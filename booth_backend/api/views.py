from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.utils import timezone
from django.db.models import F
from .models import Poll, Candidate
from .serializers import PollSerializer, CandidateSerializer
# Create your views here.



class PollCreateView(APIView):

    def post(self, request, *args, **kwargs):

        data = request.data
        print(data)
        serialize = PollSerializer(data=data)
        if serialize.is_valid():
            serialize.save()
            return Response({"message": "Poll created successfully", "data": serialize.data}, status=status.HTTP_201_CREATED)
        print(serialize.errors)
        return Response(serialize.errors, status=status.HTTP_400_BAD_REQUEST)


class PollsByWalletKeyView(APIView):
    def get(self, request, wallet_key):
        try:
            polls = Poll.objects.filter(creator_wallet_key=wallet_key).order_by('-created_at')
            serialized_polls = PollSerializer(polls, many=True).data



            return Response(serialized_polls, status=status.HTTP_200_OK)
        except Exception as e:
            print("Error fetching polls by wallet key:", str(e))
            return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class AllPollsView(APIView):
    def get(self, request):
        try:
            polls = Poll.objects.all()
            serialized_polls = PollSerializer(polls, many=True)
            print(serialized_polls.data)

            return Response(serialized_polls.data, status=status.HTTP_200_OK)
        except Exception as e:
            print("Error fetching all polls:", str(e))
            return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




class PollDetailView(APIView):
    def get(self, request, poll_id):
        try:
            poll = Poll.objects.filter(poll_id=poll_id).first()
            if not poll:
                return Response({'error': 'Poll not found'}, status=status.HTTP_404_NOT_FOUND)

            poll_data = PollSerializer(poll).data


            return Response(poll_data, status=status.HTTP_200_OK)
        except Exception as e:
            print("Error fetching poll by ID:", str(e))
            return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




class PollDeleteView(APIView):
    def delete(self, request, poll_id):
        try:
            # Try to find the poll
            poll = Poll.objects.get(poll_id=poll_id)
            poll.delete()

            return Response(
                {"message": f"Poll '{poll_id}' deleted successfully."},
                status=status.HTTP_200_OK
            )

        except Poll.DoesNotExist:
            # If poll doesn't exist, return 404
            return Response(
                {"message": f"Poll with ID '{poll_id}' not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            # For all other unexpected errors
            print("Unexpected error while deleting:", e)
            return Response(
                {"message": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class VoteCandidateView(APIView):
    def post(self, request, candidate_id):
        try:
            print(f"VoteCandidateView: received POST for candidate_id={candidate_id} body={request.data}")
            candidate = Candidate.objects.get(pk=candidate_id)

            # Expect voter_pubkey in the request body to prevent duplicate backend votes
            voter_pubkey = request.data.get('voter_pubkey')
            if not voter_pubkey:
                print("VoteCandidateView: missing voter_pubkey in request")
                return Response({'error': 'voter_pubkey is required'}, status=status.HTTP_400_BAD_REQUEST)

            # Check if this voter already voted on this poll
            from .models import Vote
            poll = candidate.poll

            # Use a DB transaction to avoid race conditions
            from django.db import transaction, IntegrityError
            try:
                with transaction.atomic():
                    # If a Vote for this poll and voter already exists, IntegrityError or exists() will prevent duplicate
                    if Vote.objects.filter(poll=poll, voter_pubkey=voter_pubkey).exists():
                        print(f"VoteCandidateView: voter {voter_pubkey} already voted on poll {poll.poll_id}")
                        return Response({'error': 'Already voted'}, status=status.HTTP_400_BAD_REQUEST)

                    Vote.objects.create(poll=poll, candidate=candidate, voter_pubkey=voter_pubkey)

                    # Increment candidate votes and poll votes atomically using QuerySet.update() to avoid
                    # leaving an F() expression on the model instance which can be confusing until refresh_from_db()
                    Candidate.objects.filter(pk=candidate.pk).update(votes=F('votes') + 1)

                    # Ensure we update the Poll using the poll.poll_id value (stable)
                    Poll.objects.filter(poll_id=poll.poll_id).update(votes=F('votes') + 1)

            except IntegrityError as ie:
                print(f"VoteCandidateView: IntegrityError when creating vote: {ie}")
                return Response({'error': 'Already voted'}, status=status.HTTP_400_BAD_REQUEST)

            # Refresh candidate from DB to get the updated integer value
            candidate.refresh_from_db()

            return Response({
                "message": "Vote recorded successfully",
                "candidate_id": candidate.id,
                "updated_votes": candidate.votes,
                "poll_id": poll.poll_id
            }, status=status.HTTP_200_OK)

        except Candidate.DoesNotExist:
            print(f"VoteCandidateView: candidate {candidate_id} not found")
            return Response(
                {"error": "Candidate not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            print(f"Error recording vote: {str(e)}")
            return Response(
                {"error": "Internal server error"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


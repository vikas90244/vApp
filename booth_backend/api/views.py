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
            candidate = Candidate.objects.get(pk=candidate_id)
            candidate.votes += 1
            candidate.save()
            
            # Update the poll's total votes
            Poll.objects.filter(poll_id=candidate.poll_id).update(votes=F('votes') + 1)
            
            return Response({
                "message": "Vote recorded successfully",
                "candidate_id": candidate.id,
                "updated_votes": candidate.votes,
                "poll_id": candidate.poll_id
            }, status=status.HTTP_200_OK)
            
        except Candidate.DoesNotExist:
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


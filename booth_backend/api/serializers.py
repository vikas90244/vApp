from rest_framework import serializers
from .models import Poll, Candidate


class CandidateSerializer(serializers.ModelSerializer):
    # include poll_id so frontend can reconstruct on-chain PDAs
    poll_id = serializers.CharField(source='poll.poll_id', read_only=True)

    class Meta:
        model = Candidate
        fields = ['id', 'name', 'votes', 'poll_id']

class PollSerializer(serializers.ModelSerializer):
    candidates = CandidateSerializer(many=True,)
    class Meta:
        model = Poll
        fields = [
            'id', 'poll_id', 'poll_title', 'description',
            'poll_start', 'poll_end', 'votes', 'creator_wallet_key', 'created_at', 'candidates'
        ]
        read_only_fields = ['id', 'created_at', 'votes']

    def create(self, validated_data):
        candidates_data = validated_data.pop('candidates')
        poll = Poll.objects.create(**validated_data)

        for candidate in candidates_data:
             Candidate.objects.create(poll = poll, **candidate)

        return poll

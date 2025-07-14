from django.db import models


# Create your models here.
class Poll(models.Model):
    id = models.AutoField(primary_key=True)
    poll_id = models.CharField(max_length=255, unique=True)
    poll_title = models.CharField(max_length=255)
    description = models.CharField(max_length=5000)
    poll_start = models.DateTimeField()
    poll_end = models.DateTimeField()
    votes = models.IntegerField(default=0)
    creator_wallet_key = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.poll_title} created by {self.creator_wallet_key}"


class Candidate(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    poll = models.ForeignKey(
        Poll, to_field="poll_id", db_column="poll_id", on_delete=models.CASCADE, related_name="candidates"
    )
    votes = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.name} (for poll {self.poll.poll_id})"

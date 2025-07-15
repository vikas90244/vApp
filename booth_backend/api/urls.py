from django.urls import path
from .views import PollCreateView, PollsByWalletKeyView, PollDetailView, AllPollsView, PollDeleteView, VoteCandidateView


urlpatterns = [
    path('create-poll/', PollCreateView.as_view(), name='create_poll'),
    path('polls/by-wallet/<str:wallet_key>/', PollsByWalletKeyView.as_view(), name='polls_by_wallet'),
    path('polls/<str:poll_id>/', PollDetailView.as_view(), name='poll_detail'),
    path('polls/', AllPollsView.as_view(), name='all_polls'),
    path('polls/delete/<str:poll_id>/', PollDeleteView.as_view(), name='delete_poll'),
    path('candidates/<int:candidate_id>/vote/', VoteCandidateView.as_view(), name='vote_candidate'),
]

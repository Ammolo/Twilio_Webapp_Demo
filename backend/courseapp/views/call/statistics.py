from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from courseapp.models import Call
from datetime import datetime, timedelta
from django.db.models import Avg, Count
from django.db.models.functions import TruncDay

class StatisticsView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        #Fetching call history between x and y date, called by a user.
        period = request.query_params.get('period', None)
        type = request.query_params.get('type', None)

        end_date = datetime.today()

        if period == "Today":
            start_date = end_date
        elif period == "Last 7 days":
            start_date = end_date - timedelta(days=7)
        elif period == "Last 14 days":
            start_date = end_date - timedelta(days=14)
        elif period == "Last 30 days":
            start_date = end_date - timedelta(days=30)
        elif period == "Last 90 days":
            start_date = end_date - timedelta(days=90)
        elif period == "Last 365 days":
            start_date = end_date - timedelta(days=365)
        else:
            start_date = None
            end_date = None

        # if no date, then all time
        if start_date is not None and end_date is not None:
            calls = Call.objects.filter(manage_by=request.user, start__date__range=[start_date, end_date])
        else:
            calls = Call.objects.filter(manage_by=request.user)


        #Average duration compontent
        if type == "avg":

            #get avg duration of the entire period, round it up and prevent crash if round on 0
            aggregate_data = calls.aggregate(avg_duration=Avg('duration'))
            period_avg_call = aggregate_data.get('avg_duration', 0)
            period_avg_call = round(period_avg_call) if period_avg_call is not None else 0

            #average duration for each unqie day, stored in 2 arrays duration and dates, prevent crash if round on 0. Used by apex
            calls_by_day = calls.annotate(day=TruncDay('start')).values('day').annotate(avg_duration=Avg('duration')).order_by('day')
            avg_call_duration = [round(entry['avg_duration']) for entry in calls_by_day if entry['avg_duration'] is not None]
            period_dates = [entry['day'].strftime('%Y-%m-%d') for entry in calls_by_day]

            response_data = {
                'period_avg_call': period_avg_call,
                'avg_call_duration': avg_call_duration,
                'period': period_dates
            }

        #call count breakdown component
        elif type == "ccb":
            total_calls = calls.count()
            
            #answer results on phonecalls grouped by answertype.
            # Answerd, failed, unanswerd atm.
            calls_by_answertype = calls.values('answer_type').annotate(count=Count('answer_type'))
            formatted_calls_by_answertype = {item['answer_type']: item['count'] for item in calls_by_answertype}

            response_data = {
                'total_calls': total_calls,
                'answer_type': formatted_calls_by_answertype
            }

        if response_data:
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

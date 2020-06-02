from peer_assessment.models import *
from django.core.mail import send_mail
from django.conf import settings
import datetime
import json
from django.core import serializers


def send_email_at_midnight():
    assessments = Assessment.objects.filter(sent_email=False)
    for i in assessments:
        recipient_list = list()
        recipient_list.append('yangud@bc.edu')
        if i.start_date <= datetime.date.today():
            group_assessments = Group_Assessment.objects.filter(assessment_id=i)
            for g in group_assessments:
                group_students = Group_Student.objects.filter(group_id=g.group_id)
                for gs in group_students:
                    recipient_list.append(str(gs.student_id.email))
            i.sent_email = True
            i.save()
            subject = 'Reminder that peer assessment ' + str(i.assessment_name) + ' is now open!'
            message = 'This is an email reminding you that the window to complete assessment: ' + \
                      str(i.assessment_name) + ' has started.'
            # message = 'This is an email reminding you that the window to complete assessment: ' + \
            #           str(i.assessment_name) + ' has started.' + str(len(recipient_list))
            email_from = settings.EMAIL_HOST_USER
            send_mail(subject, message, email_from, recipient_list)


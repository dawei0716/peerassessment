from django.views.decorators.csrf import csrf_exempt, requires_csrf_token
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from peer_assessment.models import *
from django.core import serializers
import json
import datetime
# from snippets.models import Snippet
# from snippets.serializers import SnippetSerializer

# handles displaying students peer assessments
# Also handles csrf token in order to allow the request to go through
@requires_csrf_token
@api_view(['POST'])
def view_assessments(request):
    """
    List all code snippets, or create a new snippet.
    """
    print("view_assessments-student")
    data = request.data
    email = data.get("email")
    t = data.get("type")
    # selectedClass = data.get("selectedClass")
    selectedClass = data.get("studentSelectedClass")

    b = "F"
    # Try to write to database to add assessment to list, dummy code in place
    # try:
    #get student
    student = User.objects.get(email=email)
    #get all grades where this student is the grader
    grader = Grade.objects.filter(grader=student)
    ids = list()
    #get all assessment questions in the grader
    for i in grader:
        ids.append(i.assessment_question.id)
    assess_q = Assessment_Question.objects.filter(pk__in=ids)

    ids2 = list()
    #get all assessments referenced in these assessment questions
    for i in assess_q:
        ids2.append(i.assessment_id.id)
    a = Assessment.objects.filter(pk__in=ids2)
    assessments = serializers.serialize('json', a)

    c = Class.objects.get(pk=selectedClass)
    group = Group.objects.filter(class_id=c)
    gs = Group_Student.objects.get(student_id=student, group_id__in=group)
    gS = Group_Student.objects.filter(group_id=gs.group_id)
    print(gS)
    ids3 = list()
    for i in gS:
        ids3.append(i.student_id.id)
    print(ids3)
    teamMembers = User.objects.filter(pk__in=ids3)
    print(teamMembers)
    members = list()
    for i in teamMembers:
        name = i.first_name + " " + i.last_name
        pk = i.id
        members.append(
            {
                "name": name,
                "pk": pk
            }
        )


    qpks = [x for x in range(1, 11)]
    qsMC = Question.objects.filter(pk__in=qpks, type='Multiple Choice')
    qsOR = Question.objects.filter(pk__in=qpks, type='Open Response')
    # print(qsMC)

    assess_for_class = a.filter(class_id=c)
    closed = list()
    open = list()
    for i in assess_for_class:
        if i.due_date >= datetime.date.today():
            open.append(i)
        else:
            closed.append(i)
    openassessments = serializers.serialize('json', open)
    closedassessments = serializers.serialize('json', closed)
    g = serializers.serialize('json', group)
    # tM = serializers.serialize('json', members)
    questionsMC = serializers.serialize('json', qsMC)
    questionsOR = serializers.serialize('json', qsOR)

    b = "t"
    # except:
    #     b = "F"
    print(b)
    return Response([openassessments, closedassessments, members, questionsMC, questionsOR], status=status.HTTP_200_OK)


# handles displaying students completed assessments
# Also handles csrf token in order to allow the request to go through
@requires_csrf_token
@api_view(['POST'])
def view_completed_assessments(request):
    """
    List all code snippets, or create a new snippet.
    """
    print("in view_completed_Assess")

    data = request.data
    email = data.get("email")
    t = data.get("type")
    print(data)
    selectedClass = data.get("studentSelectedClass")




    resMC = list()
    resOR = list()
    qpks = [x for x in range(1, 11)]
    qsMC = Question.objects.filter(pk__in=qpks, type='Multiple Choice')
    qsOR = Question.objects.filter(pk__in=qpks, type='Open Response')

    for i in qsMC:
        resMC.append(
            {
                "question_id": i.id,
                "question": i.question,
                "grade": 0
            }
        )

    for i in qsOR:
        resOR.append(
            {
                "question_id": i.id,
                "question": i.question,
                "grade": "For Professor View Only"
            }
        )



    b = "F"
    # Try to write to database to add assessment to list, dummy code in place
    try:
        student = User.objects.get(email=email)
        name = student.first_name + " " + student.last_name
        grader = Grade.objects.filter(grader=student)
        ids = list()
        for i in grader:
            ids.append(i.assessment_question.id)
        assess_q = Assessment_Question.objects.filter(pk__in=ids)

        ids2 = list()
        for i in assess_q:
            ids2.append(i.assessment_id.id)
        a = Assessment.objects.filter(pk__in=ids2)

        c = Class.objects.get(pk=selectedClass)

        completed = a.filter(class_id=c, released=True)
        print(completed)



        completed_assessments = serializers.serialize('json', completed)
        print(completed_assessments)

        b = "t"
    except:
        b = "F"
    print(b)
    return Response([completed_assessments, name, resMC, resOR], status=status.HTTP_200_OK)

# Code ran when the student does assessment
# Also handles csrf token in order to allow the request to go through
@requires_csrf_token
@api_view(['POST'])
def student_grade(request):
    """
    List all code snippets, or create a new snippet.
    """
    print("in student_grade")
    data = request.data
    toDoIndex = data.get("toDoIndex")
    todoSelected = data.get("todoSelected")
    email = data.get("email")
    answers = data.get("answers")
    # a = json.loads(answers)
    print(answers)
    t = data.get("type")

    print(toDoIndex)
    print(todoSelected)
    assessment = Assessment.objects.get(pk=todoSelected['pk'])
    print(assessment)
    grader = User.objects.get(email=email)
    for i in answers:
        # print(i)
        gradee = User.objects.get(pk=i)
        print(gradee)
        for j in answers[i]:
            question = Question.objects.get(pk=j)
            aq = Assessment_Question.objects.get(assessment_id=assessment, question_id=question)
            grade = Grade.objects.get(grader=grader, gradee=gradee, assessment_question=aq)
            grade.score = answers[i][j]
            grade.completion = True
            grade.save()
            print(str(j) + ' : ' + str(answers[i][j])) #j is key, answers[i][j] is value
            print(grade)

    b = "F"
    # Try to write to database to add assessment to list, dummy code in place
    try:
        # user = User.objects.get(email=email, password=currentPassword)
        b = "t"
    except:
        b = "F"
    print(b)
    print(data)
    return Response(b, status=status.HTTP_200_OK)

@requires_csrf_token
@api_view(['POST'])
def student_aggregated_results(request):
    data = request.data
    email = data.get("email")
    t = data.get("type")
    selectedAssessment = data.get("selectedAssessment")
    aggregatedResultsMC = data.get("aggregatedResultsMC")
    aggregatedResultsOR = data.get("aggregatedResultsOR")
    print(selectedAssessment)
    print(aggregatedResultsMC)
    print(aggregatedResultsOR)

    b = "F"
    user = User.objects.get(email=email)
    assessment = Assessment.objects.get(pk=selectedAssessment['pk'])

    all_mc_questions = Question.objects.filter(type="Multiple Choice")
    mc_questions = Assessment_Question.objects.filter(
        assessment_id=assessment, question_id__in=all_mc_questions)

    grader = Grade.objects.filter(grader=user, assessment_question__in=mc_questions, completion=False)
    print("len(grader)=" + str(len(grader)))
    totalscore = 0
    count = 0
    avg_score = 0
    if len(grader) == 0:
        for i in aggregatedResultsMC:
            print(i["question_id"])
            q = Question.objects.get(pk=i["question_id"])
            aq = Assessment_Question.objects.get(assessment_id=assessment, question_id=q)
            grades = Grade.objects.filter(gradee=user, assessment_question=aq, completion=True)
            score = 0
            for j in grades:
                score += int(j.score)
            i["grade"] = round(score/len(grades), 2)
            totalscore += score/len(grades)
        avg_score = round(totalscore/len(aggregatedResultsMC), 2)

    try:
        # user = User.objects.get(email=email, password=currentPassword)
        b = "t"
    except:
        b = "F"
    print(b)
    print(data)
    print(aggregatedResultsMC)
    return Response([aggregatedResultsMC, avg_score], status=status.HTTP_200_OK)

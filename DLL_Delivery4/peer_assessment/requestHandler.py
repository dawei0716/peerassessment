from django.views.decorators.csrf import csrf_exempt, requires_csrf_token
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from peer_assessment.models import User
# from snippets.models import Snippet
# from snippets.serializers import SnippetSerializer

#Handles post request to check database for match in username, password and type of user
#Also handles csrf token in order to allow the request to go through
@requires_csrf_token
@api_view(['POST'])
def validate_user(request):
    """
    List all code snippets, or create a new snippet.
    """
    data = request.data
    email = data.get("email")
    pwd = data.get("pwd")
    t = data.get("t")
    print(email)
    print(pwd)
    print(t)
    #b is the data returned to the client essentially as a str(boolean) to tell the client what state to go to next
    #This is because there is no actual html returned, react just changes the screen and url on the client side
    b="F"
    try:
        user = User.objects.get(email=email, password=pwd)
        print("right username and pwd")
        print(user.type)
        if user.type == t:
            b = "T"
        else:
            b = "F"
    except:
        b = "F"
    print(b)
    responseData = list()
    responseData.append(b)
    responseData.append(email)
    print(data)
    return Response(responseData, status=status.HTTP_200_OK)

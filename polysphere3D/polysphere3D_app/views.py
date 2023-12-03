from django.shortcuts import render

# Create your views here.


def hello_world(request):
    return render(request, 'polysphere3D_app/hello_world.html')

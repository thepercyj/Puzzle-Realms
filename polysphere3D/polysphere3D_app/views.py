from django.shortcuts import render

# Create your views here.


def ui_template(request):
    return render(request, 'polysphere3D_app/polysphere3d.html')

def sample(request):
    return render(request, 'polysphere3D_app/sample.html')
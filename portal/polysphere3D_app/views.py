from django.shortcuts import render


# Create your views here.


def ui_template(request):
    if request.method == 'POST':
        data_from_landing = request.POST.get('data_from_landing', '')
        return render(request, 'polysphere3D_app/polysphere3d.html', {'data_from_landing': data_from_landing})
    else:
        return render(request, 'polysphere3D_app/polysphere3d.html', {'data_from_landing': ''})


def landing(request):
    return render(request, 'polysphere3D_app/landing.html')

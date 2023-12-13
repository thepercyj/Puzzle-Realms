from django.shortcuts import render, redirect


# Create your views here.
def landing(request):
    if request.method == 'POST':
        data_from_landing = request.POST.get('data_from_landing', '')
        request.session['data_from_landing'] = data_from_landing
        return redirect('polysphere3D:ui_template')
    else:
        return render(request, 'polysphere3D_app/landing.html')


def ui_template(request):
    data_from_landing = request.session.get('data_from_landing', '')
    return render(request, 'polysphere3D_app/polysphere3d.html', {'data_from_landing': data_from_landing})

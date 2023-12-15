from django.shortcuts import render


def polysphere3D_doc(request):
    return render(request, 'polysphere3D_app/out/index.html')


def polysphere3D_AnimationObjectGroup_doc(request):
    return render(request, 'polysphere3D_app/out/AnimationObjectGroup.html')


def polysphere3D_BooleanKeyframeTrack_doc(request):
    return render(request, 'polysphere3D_app/out/BooleanKeyframeTrack.html')


def polysphere3D_CameraHelper_doc(request):
    return render(request, 'polysphere3D_app/out/CameraHelper.html')


def polysphere3D_ColorKeyframeTrack_doc(request):
    return render(request, 'polysphere3D_app/out/ColorKeyframeTrack.html')


def polysphere3D_CompressedTextureLoader_doc(request):
    return render(request, 'polysphere3D_app/out/CompressedTextureLoader.html')


def polysphere3D_ConvertSolutionFormat_doc(request):
    return render(request, 'polysphere3D_app/out/ConvertSolutionFormat.js.html')


def polysphere3D_CreateObjects_doc(request):
    return render(request, 'polysphere3D_app/out/CreateObjects.js.html')


def polysphere3D_CubicInterpolant_doc(request):
    return render(request, 'polysphere3D_app/out/CubicInterpolant.html')


def polysphere3D_Curve_doc(request):
    return render(request, 'polysphere3D_app/out/Curve.html')


def polysphere3D_Cylindrical_doc(request):
    return render(request, 'polysphere3D_app/out/Cylindrical.html')


def polysphere3D_DataTextureLoader_doc(request):
    return render(request, 'polysphere3D_app/out/DataTextureLoader.html')


def polysphere3D_DiscreteInterpolant_doc(request):
    return render(request, 'polysphere3D_app/out/DiscreteInterpolant.html')


def polysphere3D_EventDispatcher_doc(request):
    return render(request, 'polysphere3D_app/out/EventDispatcher.html')


def polysphere3D_ExtrudeGeometry_doc(request):
    return render(request, 'polysphere3D_app/out/ExtrudeGeometry.html')


def polysphere3D_GenerateProblemMatrix_doc(request):
    return render(request, 'polysphere3D_app/out/GenerateProblemMatrix.js.html')


def polysphere3D_global_doc(request):
    return render(request, 'polysphere3D_app/out/global.html')


def polysphere3D_Interpolant_doc(request):
    return render(request, 'polysphere3D_app/out/Interpolant.html')


def polysphere3D_module_exports_doc(request):
    return render(request, 'polysphere3D_app/out/module.exports.html')


def polysphere3D_NumberKeyframeTrack_doc(request):
    return render(request, 'polysphere3D_app/out/NumberKeyframeTrack.html')


def polysphere3D_OrbitControl_doc(request):
    return render(request, 'polysphere3D_app/out/OrbitControl.html')


def polysphere3D_OrbitControl_js_doc(request):
    return render(request, 'polysphere3D_app/out/OrbitControl.js.html')


def polysphere3D_PMREMGenerator_doc(request):
    return render(request, 'polysphere3D_app/out/PMREMGenerator.html')


def polysphere3D_Pyramid_doc(request):
    return render(request, 'polysphere3D_app/out/Pyramid.html')


def polysphere3D_pyramid_js_doc(request):
    return render(request, 'polysphere3D_app/out/pyramid.js.html')


def polysphere3D_PyramidLayer_doc(request):
    return render(request, 'polysphere3D_app/out/PyramidLayer.html')


def polysphere3D_QuaternionKeyframeTrack_doc(request):
    return render(request, 'polysphere3D_app/out/QuaternionKeyframeTrack.html')


def polysphere3D_QuaternionLinearInterpolant_doc(request):
    return render(request, 'polysphere3D_app/out/QuaternionLinearInterpolant.html')


def polysphere3D_scene_doc(request):
    return render(request, 'polysphere3D_app/out/scene.html')


def polysphere3D_scene_js_doc(request):
    return render(request, 'polysphere3D_app/out/scene.js.html')


def polysphere3D_Shape3D_doc(request):
    return render(request, 'polysphere3D_app/out/Shape3D.html')


def polysphere3D_Shapes3D_js_doc(request):
    return render(request, 'polysphere3D_app/out/Shapes3D.js.html')


def polysphere3D_sol_scene_js_doc(request):
    return render(request, 'polysphere3D_app/out/sol_scene.js.html')


def polysphere3D_Solver_js_doc(request):
    return render(request, 'polysphere3D_app/out/Solver.js.html')


def polysphere3D_Spherical_doc(request):
    return render(request, 'polysphere3D_app/out/Spherical.html')


def polysphere3D_SphericalHarmonics3_doc(request):
    return render(request, 'polysphere3D_app/out/SphericalHarmonics3.html')


def polysphere3D_StringKeyframeTrack_doc(request):
    return render(request, 'polysphere3D_app/out/StringKeyframeTrack.html')


def polysphere3D_three_js_doc(request):
    return render(request, 'polysphere3D_app/out/three.js.html')


def polysphere3D_UI_js_doc(request):
    return render(request, 'polysphere3D_app/out/UI.js.html')


def polysphere3D_VectorKeyframeTrack_doc(request):
    return render(request, 'polysphere3D_app/out/VectorKeyframeTrack.html')


# Create your views here.
def landing(request):
    return render(request, 'polysphere3D_app/landing.html')


def ui_template(request):
    if request.method == 'POST':
        data_from_landing = request.POST.get('data_from_landing', '')
        request.session['data_from_landing'] = data_from_landing
        return render(request, 'polysphere3D_app/polysphere3d.html', {'data_from_landing': data_from_landing})
    else:
        return render(request, 'polysphere3D_app/polysphere3d.html')

from django import forms


class PuzzleUploadForm(forms.Form):
    puzzle_input = forms.FileField()

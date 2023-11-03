from django.db import models


class PuzzleSolution(models.Model):
    solution_text = models.TextField()

    def __str__(self):
        return f'Solution {self.id}'

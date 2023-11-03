from django.db import models


# Create your models here.
class PuzzlePiece(models.Model):
    piece_id = models.CharField(max_length=1)
    piece_shape = models.TextField()

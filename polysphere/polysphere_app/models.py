from django.db import models
import json

class KanoodleProblem(models.Model):
    piece_descriptions = models.TextField(help_text="JSON array of piece strings")
    grid_width = models.IntegerField()
    grid_height = models.IntegerField()

    def get_piece_descriptions(self):
        """Parses and returns the piece descriptions from JSON."""
        return json.loads(self.piece_descriptions)

class KanoodleSolution(models.Model):
    problem = models.ForeignKey(KanoodleProblem, related_name='solutions', on_delete=models.CASCADE)
    solution_data = models.TextField(help_text="Formatted string of the solution")

    def get_solution_data(self):
        """Parses and returns the solution data from JSON if needed."""
        return self.solution_data  # Or parse as JSON if the data is stored in JSON format


class PuzzlePiece(models.Model):
    shape = models.CharField(max_length=1, unique=True)
    grid = models.TextField(help_text="JSON array of strings representing the piece's shape")
    image_path = models.CharField(max_length=100)
    rotation = models.IntegerField(default=0)

    def get_grid(self):
        """Parses and returns the grid from JSON."""
        return json.loads(self.grid)
from django.db import models
import json


class KanoodleProblem(models.Model):
    """
    Represents a Kanoodle problem.

    Attributes:
        piece_descriptions (TextField): JSON array of piece strings.
        grid_width (IntegerField): Width of the grid.
        grid_height (IntegerField): Height of the grid.
    """

    piece_descriptions = models.TextField(help_text="JSON array of piece strings")
    grid_width = models.IntegerField()
    grid_height = models.IntegerField()

    def get_piece_descriptions(self):
            """Parses and returns the piece descriptions from JSON.

            Returns:
                list: A list of piece descriptions parsed from JSON.
            """
            return json.loads(self.piece_descriptions)


class KanoodleSolution(models.Model):
    """
    Represents a solution for a Kanoodle problem.

    Attributes:
        problem (KanoodleProblem): The Kanoodle problem associated with the solution.
        solution_data (str): Formatted string of the solution.
    """

    problem = models.ForeignKey(KanoodleProblem, related_name='solutions', on_delete=models.CASCADE)
    solution_data = models.TextField(help_text="Formatted string of the solution")

    def get_solution_data(self):
            """Parses and returns the solution data from JSON if needed.

            Returns:
                The solution data stored in the object.
            """
            return self.solution_data  # Or parse as JSON if the data is stored in JSON format


class PuzzlePiece(models.Model):
    """
    Represents a puzzle piece.

    Attributes:
        shape (str): The shape of the puzzle piece.
        grid (str): JSON array of strings representing the piece's shape.
        image_path (str): The path to the image associated with the puzzle piece.
        rotation (int): The rotation angle of the puzzle piece.
    """

    shape = models.CharField(max_length=1, unique=True)
    grid = models.TextField(help_text="JSON array of strings representing the piece's shape")
    image_path = models.CharField(max_length=100)
    rotation = models.IntegerField(default=0)

    def get_grid(self):
            """Parses and returns the grid from JSON.

            Returns:
                dict: The parsed grid as a dictionary.
            """
            return json.loads(self.grid)

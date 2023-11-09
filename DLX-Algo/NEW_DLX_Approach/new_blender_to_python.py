import pygame
import sys

# Initialize Pygame
pygame.init()

# Set up display
screen = pygame.display.set_mode((400, 400))
pygame.display.set_caption("Kanoodle Puzzle Piece")

# Define colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

# Define the shape of the Kanoodle piece
shape = [(0, 0), (50, 0), (50, 100), (0, 100), (0, 50)]

# Define the outline of the shape
outline = [(1, 1), (49, 1), (49, 99), (1, 99), (1, 49)]

# Main loop
while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    # Clear the screen
    screen.fill(WHITE)

    # Draw the shape
    pygame.draw.polygon(screen, BLACK, shape)

    # Draw the outline
    pygame.draw.polygon(screen, BLACK, outline, 2)

    # Update the display
    pygame.display.flip()
# ASE-Group-6
 This is the repository for the module Advanced Software Engineering of Group 6.

# Project Description
A web-based N-Queens Puzzle Solver using Django, python, HTML, and javascript.

# What is an N-Queens Puzzle?
The N-queens puzzle is a classic problem in combinatorial mathematics and computer science. It's a puzzle that involves placing N chess queens on an N×N chessboard in such a way that no two queens threaten each other. In other words, no two queens should be in the same row, column, or diagonal.

# What is a Polysphere solver?
Polysphere is placing a set of 11 pieces into a three-dimensional puzzle board. The pieces have different forms, and the goal is to arrange them so that they fit together. Pattern Matching Puzzles frequently need spatial reasoning, vision, and strategic thinking. Identifying and managing patterns in a spatial context is required to solve them. Arranging parts to match a precise pattern, building structures, or accomplishing objectives within a limited space can all be challenging. A web-based UI was built for the Polysphere puzzle solver, which requires you to fit 12 different pieces into a specified board arrangement.It consists of a interactive user interface that enables users to arrange and visualize Puzzle pieces on the board.
To identify optimal solutions for diverse Polysphere puzzle combinations, we used backtracking algorithm using the Donal Knuth's Dancing link algorithm.

# What is a Polysphere Pyramid solver?
Another development of "Polysphere Puzzle" into a pyramid structure was a part of the group project. This task aimed to design a professional puzzle game where players manipulate and solve puzzles with pyramid-shaped structures and three-dimensional spherical objects. Challenges may involve adjusting or placing the different pieces within a three-dimensional space to get a pyramid structure.
To identify optimal solutions for diverse Polysphere puzzle combinations, we used backtracking algorithm using the Donal Knuth's Dancing link algorithm. Using three.js and orbitcontrol.js provides our 3D space for polysphere pyramid puzzle.

# What is a new exploration for freedom task?
Freedom task involves a multifaceted approach to enhance our puzzle web application. Firstly, our focus will be on addressing any reported errors documented by our QA team in GitHub issues. Following this, we aim to consolidate all individual tasks into a developed web application, making it easily accessible for users of all ages. In addition, the functionality will be the integration of user accounts, allowing players to create personalized profiles and save their progress. Moreover, we plan to introduce a leveled structure to the puzzles, adding a dynamic element to the gaming experience. To maintain a responsive and agile development process, our commitment includes keeping the repository consistently updated with any newly identified features, resolved issues, or incoming requests addressed by each team member. Through these efforts, we strive to create an engaging and continuously evolving platform for puzzle enthusiasts.

# Puzzle Realms by ASE-Group-6
A web-based portal for various kinds of puzzle games that help improve logical thinking, spatial reasoning and boost cognitive abilities. Built using Django, Python, HTML, and JavaScript.

### Objectives
The portal is designed in order to check various algorithm efficiency and how well it can be optimized when solving puzzle logics at the same time used for entertainment for people of all ages.

### Games
- N-Queens Solver
- Polysphere Pro
- Polysphere Extreme

### Website
Portal can be accessed from [Puzzle Realms by ASE-Group-6](http://portal.amanthapa.com.np)

# Local Installation Guide

Install Visual Studio Code (VSCode):

### Step 1  
Go to the official VSCode [Website](https://code.visualstudio.com/download)
Download the installer for your operating system (Windows, macOS, or Linux).
Run the installer and follow the installation prompts.
Install PyCharm (Optional):

**OR**

If you also want to install PyCharm Community Version, go to the official PyCharm [Website](https://code.visualstudio.com/download)
Download the installer for your operating system.
Run the installer and follow the installation prompts.

### Step 2
Download our project and Extract the Zip Source Folder :
Locate the source folder you want to extract.
Right-click on the folder and choose "Extract" or use a zip utility program to extract the contents.
Open the Project Folder in VSCode:

### Step 3
Install Python Packages from requirements.txt:
Open a terminal or command prompt.
Navigate to the project directory where requirements.txt is located.
Run the following command to install the required packages:
```markdown
pip install -r requirements.txt
```

### Step 4  
Launch VSCode.
Click on "File" in the menu and select "Open Folder".
Navigate to the location where you extracted the source folder, select it, and click "Open".

### Step 5  
Open a terminal within VSCode (click on "Terminal" in the menu, then "New Terminal").
Navigate to the project directory (where manage.py is located).
Run the following command to start the Django server:
```markdown
cd portal ; python manage.py runserver
```
**OR**
```markdown
cd portal ; python manage.py runserver 0.0.0.0: xxxx ( Replace xxxx with any port you want to use to run the server on aside from default 8000)
```

Now open a web browser and browse the following address:
```markdown
http://localhost:8000 or http://127.0.0.1:8000
```
The server should now be running, That's it!!. Enjoy playing !!

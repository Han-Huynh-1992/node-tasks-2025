* Node-Tasks is a project and task management web application built using Node.js, Express, AngularJS, and MySQL, and containerized with Docker for easy deployment. The application allows users to:
  + Register and log in securely
  + Create and manage Projects
  + Add and organize Tasks within projects
  + Assign tasks to team members
  + Track task status through stages like To Do, In Progress, Testing, and Done

* How to run the app locally:
  1. Install Docker Desktop
  2. Clone the repository on master branch
  3. To start the application, from the root directory of the project, run: "docker-compose up -d" command
  4. Navigate to your browser  http://localhost:3000/  to view the app
 
* Application Flow
1. When the application starts, it automatically redirects users to the Login screen.
   + If the user does not have an account, they can click on the "Register" link to create one.
   + Once logged in, users are directed to the main dashboard.
2. From the dashboard:
   + Users can create new projects, update or delete them.
   + Inside each project, users can add tasks, assign them to users, and manage their status.
   + The UI allows easy interaction with forms for adding and editing both projects and tasks.
3. To log out, users can click the Logout button, which clears the session and redirects to the login screen.


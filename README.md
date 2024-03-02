# explodingKitten-main


This is a starter pack for creating React projects with Tailwind CSS configured. It uses React version **18.2** and Tailwind CSS version **3.2**.

## Usage

This starter pack includes a basic setup for using **Tailwind CSS with React**. To start building your own components and styles, follow these steps:

1. Clone the repository to your local machine.
    ```sh
    git clone https://github.com/AmanDhanda01/explodingKitten.git
    ```

2. Install the required packages.
    ```sh
    cd explodingKitten-main
    npm install
    ```
3. Start the React Frontend
         npm start
4. Install Dependencies for Golang Backend
    Navigate to the directory containing the Golang backend code:

        cd ../backend
    Ensure Go dependencies are installed:
   
        go mod tidy

 5.Start the Golang Backend and Redis
     Start the Redis server. Depending on your installation method, this might involve running a command like:

                redis-server
     Start the Golang server:

               go run main.go

6. Open the project in your browser at [`http://localhost:3000`](http://localhost:3000) to view your project.


export default function Home() {
  return (
    <div className="glass page-container">
      <h1>Welcome to My  Authenticator App</h1>
      <p>This project is a modern web-based authenticator application built using React, Vite, and Axios for secure and efficient user authentication. It enables users to register, log in, and manage their sessions seamlessly through a token-based authentication system. The app integrates react-router-dom for smooth navigation and routing, ensuring a dynamic single-page application experience. API requests are handled via Axios with an interceptor that automatically attaches a stored token for secure communication with the backend server (running at http://127.0.0.1:8000). It also supports role-based routing and protected routes to safeguard sensitive sections of the application. Designed for scalability and modularity, the project follows a clean folder structure with reusable components and a service-based API layer. This authenticator app serves as a foundation for building secure web applications, making it ideal for learning authentication flows or implementing custom login systems.</p>
    </div>
  );
}


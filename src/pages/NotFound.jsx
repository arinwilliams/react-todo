import { Link } from 'react-router';

function NotFound() {
    return (
        <div>
            <h2>404 - Page Not Found</h2>
            <p>The page you are looking for doesn't exist.</p>
            <Link to="/"> -- Back to Home </Link>
        </div>
    );
}

export default NotFound;

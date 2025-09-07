import ProtectedRoute from '../ProtectedRoute';
import Layout from '../../layout';

const ProtectedLayout = () => {
  return (
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  );
};

export default ProtectedLayout;

import { useState } from 'react';

function ProjectForm({ onAddProject }) {
  const [projectName, setProjectName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!projectName || !collegeName || !price) {
      setError('Please fill in all fields');
      return;
    }
    
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setError('Please enter a valid price');
      return;
    }
    
    setLoading(true);
    try {
      // Add new project
      await onAddProject({
        projectName,
        collegeName,
        price: priceValue,
        createdAt: new Date().toISOString()
      });
      
      // Reset form
      setProjectName('');
      setCollegeName('');
      setPrice('');
      setError('');
    } catch (error) {
      setError('Failed to add project');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="project-form">
      <h2>Add New Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="project-name">Project Name</label>
          <input
            type="text"
            id="project-name"
            value={projectName}
            placeholder="Enter project name"
            onChange={(e) => setProjectName(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="college-name">College</label>
          <select
            id="college-name"
            value={collegeName}
            onChange={(e) => setCollegeName(e.target.value)}
            disabled={loading}
          >
            <option value="">Select a college</option>
            <option value="Boys College">Boys College</option>
            <option value="Girls College">Girls College</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Price (Rs)</label>
          <input
            type="number"
            id="price"
            min="0"
            step="0.01"
            value={price}
            placeholder="0.00"
            onChange={(e) => setPrice(e.target.value)}
            disabled={loading}
          />
        </div>
        
        {error && <p className="error-message">{error}</p>}
        <button 
          type="submit" 
          className="submit-btn" 
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Project'}
        </button>
      </form>
    </div>
  );
}

export default ProjectForm;
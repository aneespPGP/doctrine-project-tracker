import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import ProjectForm from './ProjectForm';
import ProjectTable from './ProjectTable';

function ProjectTracker({ onLogout }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Load projects from Firestore on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projectsQuery = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(projectsQuery);
        const projectList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          price: parseFloat(doc.data().price) // Ensure price is a number
        }));
        setProjects(projectList);
      } catch (error) {
        console.error("Error fetching projects: ", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  const addProject = async (newProject) => {
    try {
      // Add to Firestore
      const docRef = await addDoc(collection(db, "projects"), newProject);
      
      // Update local state
      setProjects([{ ...newProject, id: docRef.id }, ...projects]);
      return true;
    } catch (error) {
      console.error("Error adding project: ", error);
      return false;
    }
  };
  
  const deleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        // Delete from Firestore
        await deleteDoc(doc(db, "projects", id));
        
        // Update local state
        setProjects(projects.filter(project => project.id !== id));
      } catch (error) {
        console.error("Error deleting project: ", error);
        alert("Failed to delete project. Please try again.");
      }
    }
  };
  
  return (
    <div>
      <div className="tracker-header">
        <h1>Doctrine Project Tracker</h1>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>
      
      {/* Wrap form and table in a container for side-by-side layout */}
      <div className="tracker-content">
        <ProjectForm onAddProject={addProject} />
        
        {loading ? (
          <div className="loading">Loading projects...</div>
        ) : (
          <ProjectTable projects={projects} onDeleteProject={deleteProject} />
        )}
      </div>
    </div>
  );
}

export default ProjectTracker;
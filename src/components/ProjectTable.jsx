import { useRef } from 'react';
import { usePDF } from 'react-to-pdf';

function ProjectTable({ projects, onDeleteProject }) {
  const tableRef = useRef();
  const { toPDF, targetRef } = usePDF({
    filename: 'doctrine-project-tracker-report.pdf',
    page: { 
      margin: 20,
      format: 'letter',
      orientation: 'portrait'
    }
  });
  
  // Calculate total prices
  const totalFullPrice = projects.reduce((sum, project) => sum + project.price, 0);
  const total65Percent = projects.reduce((sum, project) => sum + (project.price * 0.65), 0);
  
  // Format date for the report
  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div>
      <div className="table-header">
        <h2>Projects Overview</h2>
        <button 
          onClick={() => toPDF()} 
          className="pdf-btn"
          disabled={projects.length === 0}
        >
          Download PDF Report
        </button>
      </div>
      
      <div className="projects-container">
        <div className="pdf-container" ref={targetRef}>
          {/* Report Header - Only visible in PDF */}
          <div className="report-header">
            <h1>Doctrine Project Tracker</h1>
            <p className="report-date">Report Generated: {formattedDate}</p>
            <hr className="report-divider" />
          </div>
          
          {projects.length === 0 ? (
            <p className="empty-message">No projects added yet. Use the form to add your first project.</p>
          ) : (
            <>
              <table className="projects-table" ref={tableRef}>
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>College</th>
                    <th>Full Price</th>
                    <th>65% Price</th>
                    <th className="action-column">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr key={project.id}>
                      <td>{project.projectName}</td>
                      <td>{project.collegeName}</td>
                      <td className="price-column">Rs {project.price.toFixed(2)}</td>
                      <td className="reduced-price-column">Rs {(project.price * 0.65).toFixed(2)}</td>
                      <td className="action-column">
                        <button 
                          onClick={() => onDeleteProject(project.id)} 
                          className="delete-btn"
                          aria-label={`Delete ${project.projectName}`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="total-row">
                    <td colSpan={2}>Total</td>
                    <td className="price-column">Rs {totalFullPrice.toFixed(2)}</td>
                    <td className="reduced-price-column">Rs {total65Percent.toFixed(2)}</td>
                    <td className="action-column"></td>
                  </tr>
                </tfoot>
              </table>
              
              {/* Summary section for PDF */}
              <div className="report-summary">
                <h3>Payment Summary</h3>
                <p>Total Projects: {projects.length}</p>
                <p>Total Full Amount: Rs {totalFullPrice.toFixed(2)}</p>
                <p>Total 65% Amount: Rs {total65Percent.toFixed(2)}</p>
                <p className="summary-note">* 65% price represents the allocated payment amount per project.</p>
              </div>
              
              <div className="report-footer">
                <p>Doctrine Project Tracker &copy; {new Date().getFullYear()}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectTable;
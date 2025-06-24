import { useRef, useState, useMemo } from 'react';
import { usePDF } from 'react-to-pdf';
import './ProjectTable.css';

function ProjectTable({ projects, onDeleteProject }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const tableRef = useRef();
  const { toPDF, targetRef } = usePDF({
    filename: 'doctrine-project-tracker-report.pdf',
    page: { 
      margin: 20,
      format: 'letter',
      orientation: 'portrait'
    }
  });
  
  // Sorting function
  const sortedProjects = useMemo(() => {
    if (!sortConfig.key) return projects;
    
    return [...projects].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      // Handle string sorting (case-insensitive)
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [projects, sortConfig]);
  
  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Get sort icon
  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return '↕️';
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };
  
  // Calculate totals
  const totalFullPrice = projects.reduce((sum, project) => sum + project.price, 0);
  const total65Percent = projects.reduce((sum, project) => sum + (project.price * 0.65), 0);
  
  // Calculate college-wise statistics
  const collegeStats = useMemo(() => {
    const stats = {
      'Boys College': { count: 0, fullPrice: 0, reducedPrice: 0 },
      'Girls College': { count: 0, fullPrice: 0, reducedPrice: 0 }
    };
    
    projects.forEach(project => {
      if (stats[project.collegeName]) {
        stats[project.collegeName].count++;
        stats[project.collegeName].fullPrice += project.price;
        stats[project.collegeName].reducedPrice += project.price * 0.65;
      }
    });
    
    return stats;
  }, [projects]);
  
  // Format date for the report
  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div>
      <div className="project-table__header">
        <h2 className="project-table__title">Projects Overview</h2>
        <button 
          onClick={() => toPDF()} 
          className="project-table__pdf-btn"
          disabled={projects.length === 0}
        >
          📄 Download PDF Report
        </button>
      </div>
      
      {/* College Statistics Cards */}
      <div className="project-table__college-stats">
        <div className="project-table__stat-card project-table__stat-card--boys">
          <h3 className="project-table__stat-title">👨‍🎓 Boys College</h3>
          <div className="project-table__stat-item">
            <span className="project-table__stat-label">Total Projects:</span>
            <span className="project-table__stat-value">{collegeStats['Boys College'].count}</span>
          </div>
          <div className="project-table__stat-item">
            <span className="project-table__stat-label">Full Amount:</span>
            <span className="project-table__stat-value">Rs {collegeStats['Boys College'].fullPrice.toFixed(2)}</span>
          </div>
          <div className="project-table__stat-item">
            <span className="project-table__stat-label">65% Amount:</span>
            <span className="project-table__stat-value">Rs {collegeStats['Boys College'].reducedPrice.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="project-table__stat-card project-table__stat-card--girls">
          <h3 className="project-table__stat-title">👩‍🎓 Girls College</h3>
          <div className="project-table__stat-item">
            <span className="project-table__stat-label">Total Projects:</span>
            <span className="project-table__stat-value">{collegeStats['Girls College'].count}</span>
          </div>
          <div className="project-table__stat-item">
            <span className="project-table__stat-label">Full Amount:</span>
            <span className="project-table__stat-value">Rs {collegeStats['Girls College'].fullPrice.toFixed(2)}</span>
          </div>
          <div className="project-table__stat-item">
            <span className="project-table__stat-label">65% Amount:</span>
            <span className="project-table__stat-value">Rs {collegeStats['Girls College'].reducedPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="project-table__container">
        <div className="project-table__pdf-container" ref={targetRef}>
          {/* Report Header - Only visible in PDF */}
          <div className="project-table__report-header">
            <h1 className="project-table__report-title">📊 Doctrine Project Tracker Report</h1>
            <p className="project-table__report-date">Report Generated: {formattedDate}</p>
            <hr className="project-table__report-divider" />
          </div>
          
          {/* College Statistics in PDF */}
          <div className="project-table__pdf-stats">
            <h2 className="project-table__pdf-stat-title">College-wise Summary</h2>
            <div className="project-table__pdf-stats-grid">
              <div className="project-table__pdf-stat-section">
                <h3 className="project-table__pdf-stat-title">👨‍🎓 Boys College Statistics</h3>
                <p className="project-table__pdf-stat-text">Total Projects: {collegeStats['Boys College'].count}</p>
                <p className="project-table__pdf-stat-text">Total Full Amount: Rs {collegeStats['Boys College'].fullPrice.toFixed(2)}</p>
                <p className="project-table__pdf-stat-text">Total 65% Amount: Rs {collegeStats['Boys College'].reducedPrice.toFixed(2)}</p>
              </div>
              <div className="project-table__pdf-stat-section">
                <h3 className="project-table__pdf-stat-title">👩‍🎓 Girls College Statistics</h3>
                <p className="project-table__pdf-stat-text">Total Projects: {collegeStats['Girls College'].count}</p>
                <p className="project-table__pdf-stat-text">Total Full Amount: Rs {collegeStats['Girls College'].fullPrice.toFixed(2)}</p>
                <p className="project-table__pdf-stat-text">Total 65% Amount: Rs {collegeStats['Girls College'].reducedPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          {projects.length === 0 ? (
            <p className="project-table__empty-message">No projects added yet. Use the form to add your first project.</p>
          ) : (
            <>
              <table className="project-table__table" ref={tableRef}>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('projectName')} className="project-table__th project-table__th--sortable">
                      Project Name {getSortIcon('projectName')}
                    </th>
                    <th onClick={() => handleSort('collegeName')} className="project-table__th project-table__th--sortable">
                      College {getSortIcon('collegeName')}
                    </th>
                    <th onClick={() => handleSort('price')} className="project-table__th project-table__th--sortable">
                      Full Price {getSortIcon('price')}
                    </th>
                    <th className="project-table__th">65% Price</th>
                    <th className="project-table__th project-table__no-print">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProjects.map(project => (
                    <tr key={project.id} className={`project-table__tr ${project.collegeName === 'Boys College' ? 'project-table__tr--boys' : 'project-table__tr--girls'}`}>
                      <td className="project-table__td">{project.projectName}</td>
                      <td className="project-table__td">
                        <span className={`project-table__college-badge ${project.collegeName === 'Boys College' ? 'project-table__college-badge--boys' : 'project-table__college-badge--girls'}`}>
                          {project.collegeName === 'Boys College' ? '👨‍🎓' : '👩‍🎓'} {project.collegeName}
                        </span>
                      </td>
                      <td className="project-table__td project-table__price-column">Rs {project.price.toFixed(2)}</td>
                      <td className="project-table__td project-table__reduced-price-column">Rs {(project.price * 0.65).toFixed(2)}</td>
                      <td className="project-table__td project-table__no-print">
                        <button 
                          onClick={() => onDeleteProject(project.id)} 
                          className="project-table__delete-btn"
                          aria-label={`Delete ${project.projectName}`}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="project-table__total-row">
                    <td className="project-table__td" colSpan={2}><strong>Grand Total</strong></td>
                    <td className="project-table__td project-table__price-column"><strong>Rs {totalFullPrice.toFixed(2)}</strong></td>
                    <td className="project-table__td project-table__reduced-price-column"><strong>Rs {total65Percent.toFixed(2)}</strong></td>
                    <td className="project-table__td project-table__no-print"></td>
                  </tr>
                </tfoot>
              </table>
              
              {/* Summary section for PDF */}
              <div className="project-table__report-summary">
                <h3 className="project-table__summary-title">📈 Overall Payment Summary</h3>
                <p className="project-table__summary-text"><strong>Total Projects:</strong> {projects.length}</p>
                <p className="project-table__summary-text"><strong>Total Full Amount:</strong> Rs {totalFullPrice.toFixed(2)}</p>
                <p className="project-table__summary-text"><strong>Total 65% Amount:</strong> Rs {total65Percent.toFixed(2)}</p>
                <p className="project-table__summary-note">* 65% price represents the allocated payment amount per project.</p>
              </div>
              
              <div className="project-table__report-footer">
                <p>📚 Doctrine Project Tracker &copy; {new Date().getFullYear()}</p>
                <p>Generated on {formattedDate}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectTable;
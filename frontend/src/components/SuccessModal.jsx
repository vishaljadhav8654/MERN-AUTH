function SuccessModal(
    { title, message, onOk }) {  
    return (    
    <div className="modal-backdrop">      
    <div className="success-modal">        
        <div className="success-icon"> </div>        
        <h2>{title}</h2>        
        <p>{message}</p>        
        <button onClick={onOk}>OK</button>      
        </div>    
        </div>  
        ); 
    } 
export default SuccessModal;
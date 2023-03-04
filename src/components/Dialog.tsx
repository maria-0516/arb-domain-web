import React from 'react'

interface DialogProps {
	children?: any
	onClose: Function
}

const Dialog = ({children, onClose}: DialogProps) => {
	return (
		<div className="modal">
			<div className="modal-overlay" onClick={()=>onClose()}></div>
			<div className="modal-container">
				{children}
			</div>
		</div>
	)
}

export default Dialog
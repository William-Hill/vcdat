import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, FormGroup } from 'react-bootstrap'

class NewColormapModal extends Component{
    constructor(props){
        super(props)
        this.state = {
            name: "",
        }
    }
    
    render(){
        return(
            <Modal show={this.props.show}>
                <Modal.Header>
                    <Modal.Title>Create Colormap</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup>
                        <label
                            htmlFor="name-input"
                            className="control-label">Name</label>
                        <input
                            autoFocus
                            type="text"
                            className="form-control name-input"
                            name="name-input"
                            value={this.state.name}
                            onChange={(e) => this.setState({ name: e.target.value })} />
                    </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="btn btn-primary create"
                        onClick={() => {this.props.newColormap(this.state.name)
                        }}>Create</button>
                    <button
                        className="btn btn-default cancel"
                        onClick={() => this.props.close()}>Cancel</button>
                </Modal.Footer>
            </Modal>
        )
    }
}

NewColormapModal.propTypes = {
    show: PropTypes.bool,
    close: PropTypes.func,
    newColormap: PropTypes.func,
}

export default NewColormapModal

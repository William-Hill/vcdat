import React from "react";
import PropTypes from "prop-types";
import { DropTarget } from "react-dnd";
import DragAndDropTypes from "../../../constants/DragAndDropTypes.js";

const spec = {
    drop(props, monitor /* component */) {
        const variable = monitor.getItem();
        if (monitor.getItemType() === DragAndDropTypes.VAR) props.onDrop(variable);
    },
    hover(/* props, monitor, component */) {},
    canDrop(/* props, monitor */) {
        return true;
    }
};

const collect = function(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        is_over: monitor.isOver(),
        can_drop: monitor.canDrop()
    };
};

class InputArea extends React.Component {
    constructor(props) {
        super(props);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
    }

    handleFocus() {
        this.props.setFocus(true);
    }

    handleBlur() {
        this.props.setFocus(false);
    }

    render() {
        const { connectDropTarget, can_drop, is_over } = this.props;
        let drop_class = "";
        if (is_over && can_drop) {
            drop_class = "drop-success";
        } else if (can_drop) {
            drop_class = "drop-hint";
        }

        return connectDropTarget(
            <div className={`input-area ${drop_class}`}>
                <input
                    id="new-variable-name"
                    type="text"
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    value={this.props.new_variable_name}
                    onChange={this.props.handleNewVariableName}
                    placeholder={this.props.new_variable_placeholder}
                />
                <small id="new-variable-name-help-text" className="form-text text-muted">
                    Enter a new variable name to save the calculation to.
                </small>
                <div id="assignment">
                    <span className="glyphicon glyphicon-arrow-left" />
                </div>
                <input 
                    id="calculation"
                    type="text" 
                    value={this.props.calculation} 
                    disabled
                />
                <small id="calculation-help-text" className="form-text text-muted">
                    Construct a calculation by dragging variables here.
                </small>
            </div>
        );
    }
}

InputArea.propTypes = {
    new_variable_name: PropTypes.string,
    new_variable_placeholder: PropTypes.string,
    handleNewVariableName: PropTypes.func,
    calculation: PropTypes.string,
    setFocus: PropTypes.func,
    connectDropTarget: PropTypes.func,
    onDrop: PropTypes.func,
    can_drop: PropTypes.bool, // prop added by react-dnd
    is_over: PropTypes.bool // prop added by react-dnd
};

InputArea.defaultProps = {
    new_variable_placeholder: ""
};

export default DropTarget(DragAndDropTypes.VAR, spec, collect)(InputArea);

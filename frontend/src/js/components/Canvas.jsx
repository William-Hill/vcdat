import React, { Component } from 'react';
import { connect } from 'react-redux';
import PubSub from 'pubsub-js'
import PubSubEvents from '../constants/PubSubEvents.js'
import _ from 'lodash';
import { toast } from "react-toastify"

class Canvas extends Component{
    constructor(props){
        super(props)
    }

    shouldComponentUpdate(next_props){
        try{
            if(this.props.onTop !== next_props.onTop){
                return true
            }
            // quick and dirty deep equality check
            if(next_props.can_plot && JSON.stringify(this.props) !== JSON.stringify(next_props)){
                return true
            }
        }
        catch(e){
            console.error(e)
        }
        return false
    }

    componentDidMount() {
        try{
            this.canvas = vcs.init(this.refs.div);
            this.token = PubSub.subscribe(PubSubEvents.resize, this.resetCanvas.bind(this))
        }
        catch(e){
            if(e instanceof ReferenceError && e.message == "vcs is not defined"){
                toast.error("VCS is not defined. Try setting the VCSJS_PORT environment variable and restart vCDAT", 
                    { position: toast.POSITION.BOTTOM_CENTER }
                )
            }
            else{
                console.log(e)
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        this.canvas.clear().then(() => {
            if(this.props.can_plot){
                this.plotAll.call(this)
            }
        })
    }

    async plotAll(){ // eslint complains about this right now. Just ignore it.
        for(let [index, plot] of this.props.plots.entries()){
            await this.plot(plot, index)
        }
    }

    plot(plot, index){
        if (plot.variables.length > 0) {
            var variables = this.props.plotVariables[index];
            var dataSpecs = variables.map(function (variable) {
                var dataSpec = {
                    uri: variable.path,
                    variable: variable.cdms_var_name 
                };
                var subRegion = {};
                variable.dimension
                    .filter(dimension => dimension.values)
                    .forEach((dimension) => {
                        subRegion[dimension.axisName] = dimension.values.range;
                    })
                if (!_.isEmpty(subRegion)) {
                    dataSpec['operations'] = [{ subRegion }];
                }

                var axis_order = variable.dimension.map((dimension) => variable.axisList.indexOf(dimension.axisName));
                if (axis_order.some((order, index) => order !== index)) {
                    dataSpec['axis_order'] = axis_order;
                }
                return dataSpec;
            });
            console.log('plotting', dataSpecs, this.props.plotGMs[index], plot.template);
            return this.canvas.plot(dataSpecs, this.props.plotGMs[index], plot.template).catch((error) =>{
                this.canvas.close()
                delete this.canvas
                this.canvas = vcs.init(this.refs.div);
                if(error.data){
                    console.warn("Error while plotting: ", error)
                    toast.error(error.data.exception, {position: toast.POSITION.BOTTOM_CENTER})
                }
                else{
                    console.warn("Unknown error while plotting: ", error)
                    toast.error("Error while plotting", {position: toast.POSITION.BOTTOM_CENTER})
                }
            })
        }
    }
    /* istanbul ignore next */
    componentWillUnmount() {
        this.canvas.close();
    }

    /* istanbul ignore next */
    clearCanvas(){
        this.canvas.clear()
    }

    /* istanbul ignore next */
    resetCanvas(){
        this.canvas.close()
        delete this.canvas
        this.canvas = vcs.init(this.refs.div);
        this.forceUpdate()
    }

    render() {
        return (
            <div className={this.props.onTop ? "cell-stack-top canvas-container" : "cell-stack-bottom canvas-container"} ref="div"></div>
        )
    }
}
Canvas.propTypes = {
    plots: React.PropTypes.array,
    plotVariables: React.PropTypes.array,
    plotGMs: React.PropTypes.array,
    onTop: React.PropTypes.bool,
    clearCell: React.PropTypes.func,
    row: React.PropTypes.number,
    col: React.PropTypes.number,
    selected_cell_id: React.PropTypes.string,
    cell_id: React.PropTypes.number,
    can_plot: React.PropTypes.bool,
}

const mapStateToProps = (state, ownProps) => {
    if (!ownProps.can_plot) { // todo: This is old and likely needs to be removed.
        return {
            plotVariables: [],
        }
    }
    // When GMs are loaded, use this function to extract them from the state
    var get_gm_for_plot = (plot) => {
        return state.present.graphics_methods[plot.graphics_method_parent][plot.graphics_method];
    };

    var get_vars_for_plot = (plot) => {
        return plot.variables.map((variable) => {
            return state.present.variables[variable];
        });
    };

    return {
        plotVariables: ownProps.plots.map(get_vars_for_plot),
        plotGMs: ownProps.plots.map(get_gm_for_plot),
    }
}
const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Canvas);

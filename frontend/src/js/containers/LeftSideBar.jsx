import React from 'react'
import VarList from '../components/VarList.jsx'
import GMList from '../components/GMList.jsx'
import TemplateList from '../components/TemplateList.jsx'
import Actions from '../actions/Actions.js'
import {connect} from 'react-redux'
/* global $ */

var LeftSideBar = React.createClass({
    propTypes: {
        addFileToCache: React.PropTypes.func,
        cached_files: React.PropTypes.object,
        getColormaps: React.PropTypes.func,
        graphics_methods: React.PropTypes.object,
        loadVariables: React.PropTypes.func,
        templates: React.PropTypes.object,
        variables: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.object
        ]),
        colormaps: React.PropTypes.array,
        sheets_model: React.PropTypes.object,
        updateGraphicsMethods: React.PropTypes.func

    },
    initDragListItems(){
        $('.draggable-list-item').draggable({
            opacity: 0.7,
            helper: 'clone',
            zIndex:2,
            cursorAt: {
                left:0,
                bot: 0
            },
            cursor: 'pointer',
            stop(){
                $('.cell-stack-bottom').removeClass('plotter-to-top');
            }

        })
    },
    componentDidMount() {
        $('#left-side-bar').resizable({ghost: true, handles: 'e', minWidth: 100, maxWidth: 500})
        this.initDragListItems();
    },
    componentDidUpdate(){
        this.initDragListItems();
    },
    render() {
        return (
            <div id='left-side-bar' className=''>
                <VarList variables={this.props.variables}
                    loadVariables={this.props.loadVariables}
                    addFileToCache={this.props.addFileToCache}
                    cachedFiles={this.props.cached_files}/>
                <GMList graphicsMethods={this.props.graphics_methods}
                    updateGraphicsMethod={this.props.updateGraphicsMethod}
                    colormaps={this.props.colormaps}/>
                <TemplateList templates={this.props.templates}/>
            </div>
        )
    }
})

const mapStateToProps = (state) => {
    console.log("Mapping state to props");
    console.log(state);
    return {
        variables: state.present.variables,
        graphics_methods: state.present.graphics_methods,
        templates: state.present.templates,
        cached_files: state.present.cached_files,
        sheets_model: state.present.sheets_model,
        colormaps: state.present.colormaps,
        default_methods: state.present.default_methods
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addFileToCache: function(filename, filepath, variables) {
            dispatch(Actions.addFileToCache(filename, filepath, variables));
        },
        loadVariables: (var_list) => dispatch(Actions.loadVariables(var_list)),
        updateGraphicsMethod: (graphics_method) => {
            dispatch(Actions.updateGraphicsMethod(graphics_method))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftSideBar);

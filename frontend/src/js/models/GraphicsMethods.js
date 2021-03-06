import BaseModel from './BaseModel.js';
/* global $ */


class GraphicsMethodModel extends BaseModel {

    static reduce(state={}, action) {
        let new_graphics_methods = {};
        switch (action.type) {
            case "INITIALIZE_GRAPHICS_METHODS_VALUES":
                return action.graphics_methods;
            case "UPDATE_GRAPHICS_METHOD":
                new_graphics_methods = Object.assign({}, state)
                const gm = action.graphics_method;
                switch (gm.g_name) {
                    case "Gfb":
                        new_graphics_methods["boxfill"][gm.name] = gm;
                        break;
                    case "Gfi":
                        new_graphics_methods["isofill"][gm.name] = gm;
                        break;
                    case "Gi":
                        new_graphics_methods["isoline"][gm.name] = gm;
                        break;
                    case "Gfm":
                        new_graphics_methods["meshfill"][gm.name] = gm;
                        break;
                    case "Gv":
                        new_graphics_methods["vector"][gm.name] = gm;
                        break;
                    case "G1d":
                        new_graphics_methods["oned"][gm.name] = gm;
                        break;
                    case "3d_scalar":
                        new_graphics_methods["3d_scalar"][gm.name] = gm;
                        break;
                    case "3d_dual_scalar":
                        new_graphics_methods["3d_dual_scalar"][gm.name] = gm;
                        break;
                    case "3d_vector":
                        new_graphics_methods["3d_vector"][gm.name] = gm;
                        break;
                }
                return new_graphics_methods;
            case "CREATE_GRAPHICS_METHOD":
                new_graphics_methods = $.extend(true, {}, state)
                new_graphics_methods[action.gm_type][action.name] = $.extend(true, {}, new_graphics_methods[action.gm_type][action.base_method])
                new_graphics_methods[action.gm_type][action.name].name = action.name
                return new_graphics_methods
            case "REMOVE_GRAPHICS_METHOD":
                new_graphics_methods = $.extend(true, {}, state)
                try {
                    delete new_graphics_methods[action.gm_type][action.name]
                }
                catch(e) {
                    console.warn(e)
                }
                return new_graphics_methods
            case "DELETE_COLORMAP":
                new_graphics_methods = Object.assign({}, state)
                for(let type of Object.keys(new_graphics_methods)){
                    for(let name of Object.keys(new_graphics_methods[type])){
                        if(action.name === new_graphics_methods[type][name].colormap){
                            new_graphics_methods[type][name].colormap = "default"
                        }
                    }
                }
                return new_graphics_methods
            default:
                return state
        }
    }

    static getInitialState() {
        try {
            return vcs.getallgraphicsmethods().then((methods) => {
                // search through each gm type and check if any names start with "__"
                // If any are found, they are removed from being displayed since they are temporary names
                for(let type of Object.keys(methods)){
                    for(let name of Object.keys(methods[type])){
                        if(name.startsWith("__")){
                            delete methods[type][name]
                        }
                    }
                }
                return methods
            })
        }
        catch(e){
            console.warn(e)
            return {}
        }
    }

}

export default GraphicsMethodModel

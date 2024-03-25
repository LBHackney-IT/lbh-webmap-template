import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const config = {
    mode:"development",
    // devtool:"source-map",
    context : path.resolve(__dirname,"src"),
    entry:"/js/main.js",
    // watch:true,
    // clean:true,
    output:{
        filename:"lbh-webmap.min.js",
        path:path.resolve(__dirname,"dist"),
        library: "LBHWebmap",
        libraryTarget: "umd",
        // clean:true
    },
    module:{
        rules:[
            {
                test:/.(js|jsx)$/,
                exclude:/node_modules/,
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:["@babel/preset-env"]
                    }
                }
            }
            // ,{
            //     test:/\.scss$/,
            //     use:["style-loader","css-loader","postcss-loader","sass-loader"]
            // }
            
        ]
    }


}
export default config
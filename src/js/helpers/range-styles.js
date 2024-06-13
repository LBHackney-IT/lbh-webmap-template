import * as d3Chrom from "d3-scale-chromatic";
import{ min,max,bin,scaleSequential} from "d3"


const getFeatureData=(geojson,property)=>{
    const data = geojson.features.map((feature,index)=>feature.properties[property])
    return data

}
const getMinMax = (data) =>{
    let minValue = min(data)
    let maxValue = max(data)
    return { minValue, maxValue };
}

const createBins=(data,threshold)=>{
    let bins =null
    if(threshold){
        bins = bin().thresholds(threshold).value((d) => d)(data);
    }else{
        bins = bin().value((d) => d)(data);
    }
    // console.log('Bins',bins)
    return bins
}

const getScaleRange=(bins)=>{
    let scaleRange = bins.reduce((accumulator, currentValue,index)=>{
  
        // console.log(currentValue,currentValue.x0,currentValue.x1,index)
        if(index===0){
          accumulator.push(currentValue.x0)
        }
        accumulator.push(currentValue.x1)
        return accumulator
      },[])

    //   console.log("SCALE RANGE: ",scaleRange)
      return scaleRange
}

const colorInterpolator=(min, max,pallete)=>{
    const interpolatorFunction = scaleSequential().domain([min,max]).interpolator(d3Chrom[pallete]);
    return interpolatorFunction
}

export { getFeatureData,getMinMax,createBins,getScaleRange,colorInterpolator};
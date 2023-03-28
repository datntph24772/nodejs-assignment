import Device from "../models/devices"
import Joi from "joi"
import fuzzy from "fuzzysearch"
import url from "url"
import querystring from "querystring"
const Specification = Joi.object({
    name: Joi.string().required(),
    attributes: Joi.array().items(Joi.object({
        code: Joi.string().required(),
        name: Joi.string().required(),
        value: Joi.string().required(),
    })).min(1).required()
})



const Image=Joi.object({
    base_url:Joi.string().required(),
    is_gallery:Joi.boolean().required(),
    label:Joi.string().required(),
    large_url:Joi.string().required(),
    medium_url:Joi.string().required(),
    position:Joi.string().required(),
    small_url:Joi.string().required(),
    thumbnail_url:Joi.string().required(),
    
})
const deviceSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "{#label} Trường dữ liệu bắt buộc"
    }),
    price: Joi.number().required(),
    original_price: Joi.number().required().messages({
        "number.empty": "{#label} Trường dữ liệu bắt buộc"
    }),
    
    description: Joi.string().required().messages({
        "string.empty": "{#label} Trường dữ liệu bắt buộc"
    }),
    images:Joi.array().items(Image).min(2).required(),
    brand:Joi.object({
        id:Joi.number().required(),
        name:Joi.string().required(),
        slug:Joi.string().required()
    }),
    specifications: Joi.array().items(Specification).min(1).required()
})

export const get = async (req, res) => {
    try {
        const {name,description} = req.query;
        const queryObject = {}
        if(name){
            queryObject.name = {$regex:name,$options:"i"}
        }
        if(description){
            queryObject.description={$regex:description,$options:"i"}
        }
        const data = await Device.find(queryObject)
        res.send({
            message: "Get products successfully",
            data: data
        })
    } catch (err) {
        res.status(500).send({
            message: err
        })
    }
}

export const getById = async (req, res) => {
    try {
        const id = req.params.id
        const data = await Device.findById(id)
        res.send({
            message: "Get products successfully",
            data: data
        })
    } catch (err) {
        res.status(500).send({
            message: err
        })
    }
}

export const create = async (req, res) => {
    try {
        const body = req.body
        const { error } = deviceSchema.validate(body)
        if (error) {
            res.status(400).send({
                message: error.message,
            })
        } else {
            const data = await Device.create(body)
            res.send({
                message: "Create successfully",
                data: data
            })
        }

    } catch (err) {
        res.status(500).send({
            message: err
        })
    }
}

export const update = async (req, res) => {
    try {
        const id = req.params.id
        const body = req.body
        const { error } = deviceSchema.validate(body)
        if (error) {
            res.status(400).send({
                message: error.message,
            })
        } else {
            const data = await Device.findByIdAndUpdate(id, body)
            if (data) {
                res.send({
                    message: "Update successfully",
                    data: data
                })
            } else {
                res.status(400).send({
                    message: "Product is not existed"
                })
            }
        }
    } catch (err) {
        res.status(500).send({
            message: err
        })
    }
}

export const remove = async (req, res) => {
    try {
        const id = req.params.id
        const data = await Device.findByIdAndRemove(id)
        if (data) {
            res.send({
                message: "Delete successfully",
                data: data
            })
        } else {
            res.status(400).send({
                message: "Product is not existed"
            })
        }

    } catch (err) {
        res.status(500).send({
            message: err
        })
    }
}


export const search=async(req,res)=>{
    try {
        const query=url.parse(req.url).query
        const param=querystring.parse(query)
        const data=await Device.find()
        const result =data.filter(item=>{
            return fuzzy(param,data.name)
        })
        res.send({
            message: "Get products successfully",
            data: result
        })
    } catch (err) {
        res.status(500).send({
            message: err
        })
    }
}

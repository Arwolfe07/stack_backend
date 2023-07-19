const uuid = require('uuid').v4;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const users = require("../models/auth");


module.exports.updateSubs = async (req, res) => {
    const { tier, token, user } = req.body
    const idempotencyKey = uuid();


    try {
        console.log('inside');
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        },
        {
            apiKey: process.env.STRIPE_SECRET_KEY
        })

        console.log('after Cust')
        const result = await stripe.charges.create({
            amount: tier.pricePerMonth,
            currency: "INR",
            customer: customer.id,
            receipt_email: customer.email,
            description: `Payment of ${tier.pricePerMonth} successful`
            
        }, { idempotencyKey })
        console.log('after result')
        if(tier.id === 2)
        {
            const userUpdate = await users.findOneAndUpdate({_id: user.id}, {$set: {'membership': 'silver'}}, {new: true});
            await userUpdate.save();

        }else if(tier.id === 3){
            const userUpdate = await users.findOneAndUpdate({_id: user.id}, {$set: {'membership': 'gold'}}, {new: true});
            await userUpdate.save();
        }
        console.log("last")
        res.status(200).json(result);
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: error.message });
    }
}

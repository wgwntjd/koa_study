const Book = require('../../models/book');
const { isValidObjectId } = require('mongoose');
const Joi = require('Joi');
const { Types: { ObjectId } } = require('mongoose');

exports.list = async (ctx) => {
    let books;

    try {
        books = await Book.find()
            .sort({ _id: -1 })
            .limit(3)
            .exec();
    } catch (e) {
        return ctx.throw(500, e);
    }

    ctx.body = books;
}

exports.create = async (ctx) => {
    const {
        title,
        authors,
        publishedDate,
        price,
        tags
    } = ctx.request.body;

    const book = new Book({
        title,
        authors,
        publishedDate,
        price,
        tags
    });

    try {
        await book.save();
    } catch (e) {
        return ctx.throw(500, e);
    }

    ctx.body = book;
};

exports.get = async (ctx) => {
    const { id } = ctx.params;

    let book;

    try {
        book = await Book.findById(id).exec();
    } catch (e) {
        if (e.name === 'CastError') {
            ctx.status = 400;
            return;
        }
        return ctx.throw(500);
    }

    if (!book) {
        ctx.status = 404;
        ctx.body = { message: 'book no found', };
        return;
    }

    ctx.body = book;
};


exports.delete = async (ctx) => {
    const { id } = ctx.params;

    try {
        await Book.findByIdAndRemove(id).exec();
    } catch (e) {
        if (e.name === 'CastError') {
            ctx.status = 400;
            return;
        }
    }

    ctx.status = 204;
};

exports.replace = async (ctx) => {
    const { id } = ctx.params;

    if (!ObjectId.isValid(id)) {
        ctx.status = 400;
        return;
    }

    const schema = Joi.object().keys({
        title: Joi.string().required(),
        authors: Joi.array().items(Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().email().required
        })),
        publishedDate: Joi.date().required(),
        price: Joi.number().required(),
        tags: Joi.array().items((Joi.string()).required())
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    let book;

    try {
        book = await book.findByIdAndUpdate(id, ctx.request.body, {
            upsert: true,
            new: true
        });
    } catch (e) {
        return ctx.throw(500, e);
    }
    ctx.body = book;
}

exports.update = async (ctx) => {
    const { id } = ctx.params;

    if (!isValidObjectId.isvalid(id)) {
        ctx.status = 400;
        return;
    }

    let book;

    try {
        book = await Book.findByIdAndUpdate(id, ctx.reques.body, {
            new: true
        });
    } catch (e) {
        return ctx.throw(500, e);
    }

    ctx.body = book;
};
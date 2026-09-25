export const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (error) {
        const message = error.issues?.[0]?.message || error.errors?.[0]?.message || error.message || 'Validation error';
        res.status(400).json({ success: false, message });
    }
};
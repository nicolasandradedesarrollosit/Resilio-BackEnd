import {
    getUserModelLimit,
    updateUserData,
    banUserModel
} from '../model/pageUserModel.js';
import { 
    validateUserReq
} from '../util/validateUserReq.js';
import {
    findOneById
} from '../../client/model/userModel.js';
import {
    validateFieldsUpdate
} from '../../client/util/validateUserFields.js';

export async function getUserControllerLimit(req, res, next) {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    try {
        const validation = validateUserReq(req);
        if (!validation.valid) return res.status(400).json({ ok: false, message: validation.message });
        const users = await getUserModelLimit(limit, offset);
        res.json({ ok: true, data: users });
    }
    catch(err){
        next(err);
    }

}

export async function updateUser(req, res, next) {
    try {
        const userId = req.params.userId;
        if (!userId) return res.status(401).json({ ok: false, message: 'No autorizado' });

        const { name, province, city, phone_number } = req.body;
        
        if (!name && !province && !city && !phone_number) {
            return res.status(400).json({ ok: false, message: 'No se proporcionaron campos para actualizar' });
        }

        const exists = await findOneById(userId);
        if (!exists) return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });

        const fieldsToUpdate = {};
        if (name !== undefined) fieldsToUpdate.name = name;
        if (province !== undefined) fieldsToUpdate.province = province;
        if (city !== undefined) fieldsToUpdate.city = city;
        if (phone_number !== undefined) fieldsToUpdate.phone_number = phone_number;

        const fieldsArray = Object.values(fieldsToUpdate);

        const isValid = validateFieldsUpdate(fieldsArray);

        if(!isValid) return res.status(400).json({ ok: false, message: 'Error en los campos proporcionados' });

        const updatedUser = await updateUserData(userId, fieldsToUpdate);

        return res.status(200).json({ 
            ok: true, 
            message: 'Usuario actualizado correctamente', 
            data: updatedUser 
        });
    } catch (err) {
        next(err);
    }
}

export async function banUser (req, res, next) {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ ok: false, message: 'ID de usuario no proporcionado' });

        const exists = await findOneById(userId);
        if (!exists) return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });

        const bannedUser = await banUserModel(userId);
        if (!bannedUser) {
            return res.status(500).json({ ok: false, message: 'No se pudo banear al usuario' });
        }

        return res.status(200).json({ ok: true, message: 'Usuario baneado correctamente', data: bannedUser });
    }
    catch (err) {
        next(err);
    }
}
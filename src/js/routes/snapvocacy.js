import SnapvocacyController from '../controllers/snapvocacy';

export default function Accommodations(ctx, next) {
	new SnapvocacyController();
	next();
}
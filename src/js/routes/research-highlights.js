import ResearchHighlightsController from '../controllers/research-highlights';

export default function Accommodations(ctx, next) {
	new ResearchHighlightsController();
	next();
}
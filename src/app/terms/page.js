'use client';

// Correct path from `src/app/terms/` to `src/components/`
import DynamicPage from '../../components/DynamicPage';

export default function TermsPage() {
    return <DynamicPage pageSlug="terms-and-conditions" backLink="/profile" />;
}
'use client';

// Correct path from `src/app/support/` to `src/components/`
import DynamicPage from '../../components/DynamicPage';

export default function SupportPage() {
    return <DynamicPage pageSlug="support" backLink="/profile" />;
}
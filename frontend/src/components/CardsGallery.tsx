import React, { useState, useEffect } from 'react';
import type { Account, Card } from '../types/bank';
import { getCardsForAccount, addCard } from '../api/cards';
import { 
  formatCardNumber, 
  formatMaskedCardNumber 
} from '../utils/cardUtils';

interface CardsGalleryProps {
  userId: number;
  accounts: Account[];
  cards?: Card[];
  onAddCard?: (newCard: Card) => void;
}

const CARD_GRADIENTS = [
  'bg-gradient-to-br from-amber-800 via-orange-900 to-stone-900',
  'bg-gradient-to-br from-stone-800 via-amber-900 to-amber-950',
  'bg-gradient-to-br from-amber-700 via-yellow-900 to-stone-950',
  'bg-gradient-to-br from-orange-800 via-amber-900 to-zinc-900',
];

export const CardsGallery: React.FC<CardsGalleryProps> = ({
  userId,
  accounts,
  onAddCard,
}) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showFullNumber, setShowFullNumber] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [cardHolder, setCardHolder] = useState('John');
  const [selectedAccountId, setSelectedAccountId] = useState<number>(
    accounts[0]?.account_id || 0
  );
  const [cardType, setCardType] = useState<string>('Visa');
  const [variant, setVariant] = useState<string>('credit');

  // Keep selectedAccountId in sync if accounts list updates
  useEffect(() => {
    if (accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accounts[0].account_id);
    }
  }, [accounts, selectedAccountId]);

  // Fetch cards across ALL accounts under the user
  const fetchAllUserCards = async () => {
    if (!accounts || accounts.length === 0) {
      setCards([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Loop through all account IDs and fetch their cards in parallel
      const cardPromises = accounts.map((acc) =>
        getCardsForAccount(acc.account_id).catch(() => [])
      );
      const results = await Promise.all(cardPromises);

      // Flatten array of arrays into a single list
      const allCards = results.flat();

      // Assign visual gradient themes across all cards
      const cardsWithDesign = allCards.map((c, i) => ({
        ...c,
        bgGradient: CARD_GRADIENTS[i % CARD_GRADIENTS.length],
      }));

      setCards(cardsWithDesign);
    } catch (err) {
      console.error('Failed to load all user cards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUserCards();
  }, [accounts]);

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  };

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      user_id: userId,
      account_id: Number(selectedAccountId),
      cardHolder: cardHolder.trim() || 'John',
      type: cardType,
      variant: variant,
      status: 'active',
      spendingLimit: 5000,
    };

    try {
      const issuedCard = await addCard(userId, payload);
      
      if (onAddCard) {
        onAddCard(issuedCard);
      }

      // Re-fetch all user cards to update list
      await fetchAllUserCards();
      
      setSelectedIndex(0);
      setIsAddModalOpen(false);
    } catch (err: any) {
      console.error('Failed to create card:', err);
      setError('Card creation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCard = cards[selectedIndex];

  return (
    <section className="bg-gradient-to-b from-orange-50/80 to-amber-50/40 border border-amber-200/70 rounded-3xl p-6 flex flex-col justify-between h-full select-none overflow-hidden relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-2 z-10">
        <div>
          <h2 className="text-lg font-bold text-amber-950 tracking-tight">Your Cards</h2>
          <p className="text-xs text-amber-800/60">
            Card {cards.length > 0 ? selectedIndex + 1 : 0} of {cards.length}
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="text-xs font-semibold text-amber-900 bg-amber-200/50 hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-300/50 transition-all active:scale-95 cursor-pointer"
        >
          + Add Card
        </button>
      </div>

      {/* Gallery Carousel Window */}
      <div className="relative flex-1 flex items-center justify-between my-auto py-6 px-1">
        <button
          onClick={handlePrev}
          disabled={cards.length <= 1}
          className="z-30 w-9 h-9 rounded-full bg-amber-100/90 hover:bg-amber-200 disabled:opacity-40 text-amber-950 border border-amber-300/70 flex items-center justify-center transition-all hover:scale-110 active:scale-95 flex-shrink-0 cursor-pointer"
        >
          ‹
        </button>

        <div className="relative flex-1 overflow-hidden py-6 mx-2">
          {loading ? (
            <div className="text-center py-8 text-amber-900/60 text-xs animate-pulse">
              Loading user cards...
            </div>
          ) : cards.length === 0 ? (
            <div className="text-center py-8 text-amber-900/60 text-xs">
              No active cards found across your accounts.
            </div>
          ) : (
            <div
              className="flex items-center justify-center transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(calc(${(cards.length - 1) / 2 - selectedIndex} * (15rem + 0.5rem)))`,
              }}
            >
              {cards.map((card, idx) => {
                const isSelected = selectedIndex === idx;

                return (
                  <div
                    key={card.id || idx}
                    onClick={() => setSelectedIndex(idx)}
                    className={`w-56 sm:w-60 aspect-[1.58/1] p-5 rounded-2xl text-amber-50 cursor-pointer transition-all duration-500 ease-out transform flex flex-col justify-between mx-1 flex-shrink-0 relative border backdrop-blur-md ${
                      card.bgGradient
                    } ${
                      isSelected
                        ? 'z-20 scale-105 opacity-100 border-white/40 ring-4 ring-amber-400/50'
                        : 'z-10 scale-90 opacity-30 hover:opacity-60 border-white/20'
                    }`}
                  >
                    {/* Top Row */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold tracking-widest uppercase opacity-90">
                          {card.type}
                        </span>
                        <span className="text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded-full border border-white/20 uppercase">
                          {card.variant}
                        </span>
                      </div>
                      <span className="text-[10px] bg-emerald-500/30 text-emerald-100 border border-emerald-400/30 px-1.5 py-0.5 rounded">
                        {card.status}
                      </span>
                    </div>

                    {/* Chip */}
                    <div className="w-8 h-5.5 bg-gradient-to-r from-yellow-200 via-amber-300 to-amber-400 rounded border border-amber-500/50 flex items-center justify-center my-1">
                      <div className="w-full h-[1px] bg-amber-600/40 my-auto" />
                    </div>

                    {/* Card Number */}
                    <div className="font-mono text-sm sm:text-base tracking-widest my-1 font-semibold">
                      {isSelected && showFullNumber
                        ? formatCardNumber(card.cardNumber)
                        : formatMaskedCardNumber(card.cardNumber)}
                    </div>

                    {/* Card Bottom */}
                    <div className="flex justify-between items-end text-xs opacity-90">
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-wider opacity-75">
                          Cardholder
                        </p>
                        <p className="font-medium tracking-wide">{card.cardHolder}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-wider opacity-75">
                          Account
                        </p>
                        <p className="font-medium font-mono text-[10px]">
                          #{card.account_id}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={cards.length <= 1}
          className="z-30 w-9 h-9 rounded-full bg-amber-100/90 hover:bg-amber-200 disabled:opacity-40 text-amber-950 border border-amber-300/70 flex items-center justify-center transition-all hover:scale-110 active:scale-95 flex-shrink-0 cursor-pointer"
        >
          ›
        </button>
      </div>

      {/* Pagination Indicators */}
      <div className="flex justify-center items-center space-x-2 my-1">
        {cards.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              selectedIndex === idx
                ? 'w-6 bg-amber-800'
                : 'w-2 bg-amber-300/60 hover:bg-amber-400'
            }`}
          />
        ))}
      </div>

      {/* Action Bar */}
      {selectedCard && (
        <div className="mt-1 pt-3 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-2 z-10">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFullNumber(!showFullNumber)}
              className="text-xs font-semibold bg-amber-100/80 hover:bg-amber-200 text-amber-950 px-3 py-1.5 rounded-xl border border-amber-300/60 transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <span>{showFullNumber ? '🙈 Hide' : '👁️ Reveal'} Number</span>
            </button>
          </div>
          <span className="text-xs text-amber-800/70 font-medium">
            Limit: <strong className="text-amber-950">${Number(selectedCard.spendingLimit).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
          </span>
        </div>
      )}

      {/* Add Card Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-amber-200/60 pb-3">
              <h3 className="text-base font-bold text-amber-950">Issue New Card</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-amber-800 hover:text-amber-950 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="bg-red-100 text-red-800 p-2 text-xs rounded-xl border border-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateCard} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-amber-900 mb-1">
                  Target Account
                </label>
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-amber-300/80 bg-white text-amber-950 focus:outline-amber-800"
                >
                  {accounts.map((acc) => (
                    <option key={acc.account_id} value={acc.account_id}>
                      {acc.account_type} (#{acc.account_id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-900 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-amber-300/80 bg-white text-amber-950 focus:outline-amber-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-amber-900 mb-1">
                    Card Type
                  </label>
                  <select
                    value={cardType}
                    onChange={(e) => setCardType(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-amber-300/80 bg-white text-amber-950 focus:outline-amber-800"
                  >
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                    <option value="Amex">Amex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-900 mb-1">
                    Variant
                  </label>
                  <select
                    value={variant}
                    onChange={(e) => setVariant(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-amber-300/80 bg-white text-amber-950 focus:outline-amber-800"
                  >
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-200/40 hover:bg-amber-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-xl disabled:opacity-50"
                >
                  {isSubmitting ? 'Issuing...' : 'Issue Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
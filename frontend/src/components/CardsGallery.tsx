import React, { useState } from 'react';
import type { Account, Card } from '../types/bank';

interface CardsGalleryProps {
  cards: Card[];
  accounts: Account[];
  onAddCard: (newCard: Card) => void;
}

export const CardsGallery: React.FC<CardsGalleryProps> = ({
  cards,
  accounts,
  onAddCard,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showFullNumber, setShowFullNumber] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Form State
  const [cardHolder, setCardHolder] = useState('Alex Morgan');
  const [accountId, setAccountId] = useState<number>(
    accounts[0]?.account_id || 101
  );
  const [cardType, setCardType] = useState<'Visa' | 'Mastercard' | 'Amex'>('Visa');
  const [variant, setVariant] = useState<'debit' | 'credit'>('debit');

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  };

  const generateRandomCardNumber = () => {
    const prefix = cardType === 'Visa' ? '4532' : cardType === 'Mastercard' ? '5412' : '3782';
    const randomDigits = Array.from({ length: 12 }, () =>
      Math.floor(Math.random() * 10)
    ).join('');
    return `${prefix}${randomDigits}`;
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();

    const gradients = [
      'bg-gradient-to-br from-amber-800 via-orange-900 to-stone-900',
      'bg-gradient-to-br from-stone-800 via-amber-900 to-amber-950',
      'bg-gradient-to-br from-amber-700 via-yellow-900 to-stone-950',
      'bg-gradient-to-br from-orange-800 via-amber-900 to-zinc-900',
    ];

    const newCard: Card = {
      id: `c_${Date.now()}`,
      account_id: Number(accountId),
      cardHolder: cardHolder.trim() || 'Alex Morgan',
      cardNumber: generateRandomCardNumber(),
      expiry: '12/29',
      type: cardType,
      variant: variant,
      bgGradient: gradients[cards.length % gradients.length],
      status: 'active',
      spendingLimit: 5000,
    };

    onAddCard(newCard);
    setIsAddModalOpen(false);
    setSelectedIndex(cards.length); // Focus on newly created card
  };

  const selectedCard = cards[selectedIndex] || cards[0];

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
          onClick={() => {
            if (accounts.length > 0 && !accountId) {
              setAccountId(accounts[0].account_id);
            }
            setIsAddModalOpen(true);
          }}
          className="text-xs font-semibold text-amber-900 bg-amber-200/50 hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-300/50 transition-all active:scale-95 cursor-pointer"
        >
          + Add Card
        </button>
      </div>

      {/* Gallery Carousel Window */}
      <div className="relative flex-1 flex items-center justify-between my-auto py-6 px-1">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          disabled={cards.length <= 1}
          aria-label="Previous card"
          className="z-30 w-9 h-9 rounded-full bg-amber-100/90 hover:bg-amber-200 disabled:opacity-40 disabled:hover:scale-100 text-amber-950 border border-amber-300/70 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0 cursor-pointer"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>

        {/* Sliding Track Viewport */}
        <div className="relative flex-1 overflow-hidden py-6 mx-2">
          {cards.length === 0 ? (
            <div className="text-center py-8 text-amber-900/60 text-xs">
              No active cards. Click "+ Add Card" to issue one.
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
                    key={card.id}
                    onClick={() => setSelectedIndex(idx)}
                    className={`w-56 sm:w-60 aspect-[1.58/1] p-5 rounded-2xl text-amber-50 cursor-pointer transition-all duration-500 ease-out transform flex flex-col justify-between mx-1 flex-shrink-0 relative border backdrop-blur-md ${
                      card.bgGradient
                    } ${
                      isSelected
                        ? 'z-20 scale-105 opacity-100 border-white/40 ring-4 ring-amber-400/50'
                        : 'z-10 scale-90 opacity-30 hover:opacity-60 border-white/20'
                    }`}
                  >
                    {/* Card Top */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold tracking-widest uppercase opacity-90">
                          {card.type}
                        </span>
                        <span className="text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded-full border border-white/20">
                          {card.variant}
                        </span>
                      </div>
                      <div className="opacity-80">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h-2zm0 4h2v6h-2z" />
                        </svg>
                      </div>
                    </div>

                    {/* Chip */}
                    <div className="w-8 h-5.5 bg-gradient-to-r from-yellow-200 via-amber-300 to-amber-400 rounded border border-amber-500/50 flex items-center justify-center my-1">
                      <div className="w-full h-[1px] bg-amber-600/40 my-auto" />
                    </div>

                    {/* Card Number */}
                    <div className="font-mono text-sm sm:text-base tracking-widest my-1 font-semibold">
                      {isSelected && showFullNumber
                        ? card.cardNumber.match(/.{1,4}/g)?.join(' ')
                        : `•••• •••• •••• ${card.cardNumber.slice(-4)}`}
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
                          Expires
                        </p>
                        <p className="font-medium font-mono">{card.expiry}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          disabled={cards.length <= 1}
          aria-label="Next card"
          className="z-30 w-9 h-9 rounded-full bg-amber-100/90 hover:bg-amber-200 disabled:opacity-40 disabled:hover:scale-100 text-amber-950 border border-amber-300/70 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0 cursor-pointer"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </button>
      </div>

      {/* Pagination Dots */}
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
            <button className="text-xs font-semibold bg-amber-100/80 hover:bg-amber-200 text-amber-950 px-3 py-1.5 rounded-xl border border-amber-300/60 transition-colors cursor-pointer">
              ❄️ Freeze
            </button>
          </div>
          <span className="text-xs text-amber-800/70 font-medium">
            Limit: <strong className="text-amber-950">$5,000.00</strong>
          </span>
        </div>
      )}

      {/* Add Card Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 w-full max-w-sm space-y-4">
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

            <form onSubmit={handleCreateCard} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-amber-900 mb-1">
                  Linked Account
                </label>
                <select
                  required
                  value={accountId}
                  onChange={(e) => setAccountId(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-amber-300/80 bg-white text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {accounts.map((acc) => (
                    <option key={acc.account_id} value={acc.account_id}>
                      {acc.account_type} (#{acc.account_id}) - ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                  className="w-full text-xs px-3 py-2 rounded-xl border border-amber-300/80 bg-white text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-amber-900 mb-1">
                    Card Type
                  </label>
                  <select
                    value={cardType}
                    onChange={(e) =>
                      setCardType(e.target.value as 'Visa' | 'Mastercard' | 'Amex')
                    }
                    className="w-full text-xs px-3 py-2 rounded-xl border border-amber-300/80 bg-white text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                    onChange={(e) => setVariant(e.target.value as 'debit' | 'credit')}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-amber-300/80 bg-white text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="debit">Debit</option>
                    <option value="credit">Credit</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-200/40 hover:bg-amber-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-xl transition-colors cursor-pointer"
                >
                  Issue Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
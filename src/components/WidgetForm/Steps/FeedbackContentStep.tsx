import React from 'react';
import { CloseButton } from '../../CloseButton';
import { FeedbackType, feedbackTypes } from '..';
import { ArrowLeft, Camera } from 'phosphor-react';
import { ScreenshotButton } from '../ScreenshotButton';
import { api } from '../../../lib/api';
import { Loading } from '../../Loading';

interface FeedbackContentStepProps {
  feedbackType: FeedbackType;
  onFeedbackRestartRequested: () => void;
  onFeedbackSent: () => void;
}

export function FeedbackContentStep(
  { 
    feedbackType, 
    onFeedbackRestartRequested,
    onFeedbackSent,
  }: FeedbackContentStepProps) {

  const feedbackTypeInfo = feedbackTypes[feedbackType];
  const [screenshot, setScreenshot] = React.useState<string | null>(null);
  const [comment, setComment] = React.useState('');

  const [isSendingFeedback, setIsSendingFeedback] = React.useState(false);

  async function handleSubmitFeedback(event: React.FormEvent) {
    event.preventDefault();

    setIsSendingFeedback(true);
    await api.post('feedbacks', {
      type: feedbackTypeInfo.title,
      screenshot,
      comment
    });
    
    setIsSendingFeedback(false);
    onFeedbackSent();
  }

  return (
    <>
      <header>

        <button 
          type="button" 
          className="top-5 left-5 absolute text-zinc-400 hover:text-zinc-100"
          onClick={() => onFeedbackRestartRequested()}
        >
          <ArrowLeft weight="bold" className="w-4 h-4"/>
        </button>

        <span className="text-xl leading-6 flex items-center gap-2">
          <img className="w-6 h-6" src={feedbackTypeInfo.image.source} alt={feedbackTypeInfo.image.alt} />
          {feedbackTypeInfo.title}
        </span>
        <CloseButton/>
      </header>
      <form className="my-4 w-full" onSubmit={handleSubmitFeedback}>
        <textarea 
          onChange={(event) => setComment(event.target.value)}
          className="min-w-[304px] w-full min-h-[112px] text-sm placeholder-zinc-400 text-zinc-100 border-zinc-600 bg-transparent rounded-md focus:border-brand-500 focus:ring-brand-500 focus:ring-1 resize-none focus:outline-none scrollbar scrollbar-thumb-zinc-600 scrollbar-thin"
          placeholder="Conte com detalhes o que está acontecendo"
        >
        </textarea>

        <footer className="flex gap-2 mt-2">
          <ScreenshotButton onScreenshotTook={setScreenshot} screenshot={screenshot}/>
          <button
            type="submit"
            className="p-2 bg-brand-500 rounded-md border-transparent flex-1 flex justify-center items-center text-sm hover:bg-brand-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-brand-500 transition-colors disabled:opacity-50 disabled:hover:bg-brand-500"
            disabled={comment.length === 0 || isSendingFeedback}
          >
            { isSendingFeedback ? <Loading/> : 'Enviar feedback'}
          </button>
        </footer>
      </form>
    </>
  );
}
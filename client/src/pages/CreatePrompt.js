



import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import {
  createPrompt,
  updatePrompt,
  getPrompt,
} from '../api/prompts';
import { FiPlus, FiX, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CreatePrompt = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    watch,
  } = useForm();

  const content = watch('content', '');

  // ✅ Fetch existing prompt if in edit mode
  const { data: existingPrompt, isLoading: isFetching } = useQuery(
    ['prompt', id],
    () => getPrompt(id),
    {
      enabled: isEditMode,
      onSuccess: (data) => {
        setValue('title', data.title);
        setValue('content', data.content);
        setValue('description', data.description);
        setValue('category', data.category || 'other');
        setTags(data.tags || []);
        setIsPublic(data.isPublic);
      },
      onError: () => {
        toast.error('Failed to fetch prompt');
        navigate('/');
      },
    }
  );

  // ✅ Mutations
  const createMutation = useMutation(createPrompt, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['prompts']);
      toast.success('Prompt created successfully!');
      navigate(`/prompts/${data._id}`);
    },
    onError: () => toast.error('Failed to create prompt'),
  });

  const updateMutation = useMutation(
    ({ id, data }) => updatePrompt(id, data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['prompts']);
        toast.success('Prompt updated successfully!');
        navigate(`/prompts/${data._id}`);
      },
      onError: () => toast.error('Failed to update prompt'),
    }
  );

  const handleAddTag = () => {
    const tag = newTag.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const payload = { ...data, tags, isPublic };
      if (isEditMode) {
        await updateMutation.mutateAsync({ id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { value: 'chatgpt', label: 'ChatGPT' },
    { value: 'midjourney', label: 'Midjourney' },
    { value: 'dalle', label: 'DALL-E' },
    { value: 'bard', label: 'Bard' },
    { value: 'claude', label: 'Claude' },
    { value: 'other', label: 'Other' },
  ];

  if (isEditMode && isFetching) return <p>Loading prompt...</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEditMode ? 'Edit Prompt' : 'Create New Prompt'}
        </h1>
        <p className="text-gray-600">
          {isEditMode
            ? 'Update your existing prompt'
            : 'Share your AI prompt with the community'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                {...register('title', {
                  required: 'Title is required',
                  maxLength: 100,
                })}
                className={`input-field ${errors.title ? 'border-red-300' : ''}`}
                placeholder="Enter title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Prompt Content *
              </label>
              <textarea
                id="content"
                rows={8}
                {...register('content', {
                  required: 'Prompt content is required',
                  maxLength: 5000,
                })}
                className={`input-field resize-none ${errors.content ? 'border-red-300' : ''}`}
                placeholder="Enter your AI prompt"
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
              <div className="mt-1 text-sm text-gray-500">
                {content.length}/5000 characters
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                rows={3}
                {...register('description', { maxLength: 500 })}
                className={`input-field resize-none ${errors.description ? 'border-red-300' : ''}`}
                placeholder="Brief description..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                {...register('category')}
                className="input-field"
                defaultValue="other"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (Optional)</label>
              <div className="flex">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="input-field rounded-r-none"
                  placeholder="Add a tag"
                  maxLength={20}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!newTag.trim() || tags.length >= 10}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    #{tag}
                    <button onClick={() => handleRemoveTag(tag)} className="ml-1 text-blue-500">
                      <FiX />
                    </button>
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500">{tags.length}/10 tags • Press Enter to add</p>
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={isPublic}
                    onChange={() => setIsPublic(true)}
                    className="mr-2"
                  />
                  Public
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!isPublic}
                    onChange={() => setIsPublic(false)}
                    className="mr-2"
                  />
                  Private
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{isEditMode ? 'Updating...' : 'Creating...'}</span>
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4" />
                <span>{isEditMode ? 'Update Prompt' : 'Create Prompt'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePrompt;

// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Comment from './Comment.vue'
import type { Comment as CommentType } from '~/shared/api/contracts/article'

describe('Comment component', () => {
    it('renders the comment', async () => {
        const comment: CommentType = {
            id: 1,
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            body: 'It takes a Jacobian',
            author: {
                username: 'jake',
                bio: 'I work at statefarm',
                image: 'https://i.stack.imgur.com/xHWG8.jpg',
                following: false,
            },
        }
        const component = await mountSuspended(Comment, {
            props: { comment },
        })

        expect(component.text()).toContain('It takes a Jacobian')
        expect(component.text()).toContain('jake')
    })
})

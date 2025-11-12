# Design Guidelines: Document Submission Portal

## Design Approach
**System-Based Approach** using Material Design principles - optimal for form-heavy, utility applications requiring trust and clarity. This is a single-purpose tool focused on efficient document submission.

## Core Design Principles
1. **Clarity First**: Clear labels, helpful hints, obvious actions
2. **Trust Building**: Professional aesthetic that instills confidence in document handling
3. **Efficiency**: Minimal steps from landing to submission
4. **Accessibility**: High contrast, clear focus states, screen reader friendly

## Layout System
**Single-Page Layout** - No navigation needed, one clear purpose

**Spacing**: Use Tailwind units of 4, 6, 8, and 12 consistently
- Container padding: p-6 on mobile, p-8 on desktop
- Form field spacing: space-y-6
- Section gaps: gap-8

**Structure**:
- Centered card layout (max-w-2xl mx-auto)
- Ample whitespace around form (py-12 md:py-20)
- Form contained in elevated card with subtle shadow

## Typography
**Font Stack**: Inter or Roboto via Google Fonts

**Hierarchy**:
- Page title (h1): text-3xl md:text-4xl font-bold
- Section headings: text-xl font-semibold  
- Form labels: text-sm font-medium
- Helper text: text-sm text-gray-600
- Body text: text-base

## Component Library

### Form Components
**Input Fields**:
- Full-width inputs with rounded corners (rounded-lg)
- Clear labels above each field
- Placeholder text for guidance
- Focus states with border color change
- Error states with red border and helper text below

**Required vs Optional**:
- Mark required fields with asterisk (*)
- Clearly indicate "(opcional)" for email field

**File Upload**:
- Drag-and-drop zone with dashed border
- Click-to-browse functionality
- File type indicators (Word, PDF, JPG, PNG accepted)
- Preview of selected file name
- Clear "Remove" option once file selected
- File size limit display (e.g., "Max 10MB")

**Submit Button**:
- Large, prominent button (w-full on mobile, auto on desktop)
- Clear text: "Enviar Documentación"
- Loading state with spinner when submitting
- Disabled state while processing

### Feedback Elements
**Success Message**:
- Green checkmark icon
- Confirmation text: "Documento enviado exitosamente"
- Option to send another document

**Error Handling**:
- Inline validation for each field
- Clear error messages in Spanish
- Summary of errors above submit button if multiple issues

### Page Header
- Logo or organization name (if applicable)
- Page title: "Envío de Acta de Vacunación" or similar
- Brief subtitle explaining the purpose (1-2 lines)

### Footer
- Minimal: Contact info or support email
- Privacy/security reassurance text

## Visual Elements

**Card Design**:
- White background card on subtle gray page background
- Soft shadow for elevation (shadow-lg)
- Rounded corners (rounded-xl)

**Icons**:
- Use Heroicons for form field icons and status indicators
- Document icon for file upload area
- Check/error icons for validation feedback

**No Images Required**: This is a pure utility form - no hero image or decorative imagery needed. Focus is on the form itself.

## Responsive Behavior
- **Mobile** (base): Single column, full-width inputs, stacked layout
- **Tablet** (md): Wider form container, more breathing room
- **Desktop** (lg): Centered card (max-w-2xl), optimal reading width

Form remains single-column across all breakpoints for simplicity.

## Animations
**Minimal, purposeful only**:
- Smooth transitions on input focus (150ms)
- Button press effect (scale on click)
- Success/error message fade-in
- File upload progress indicator

## Accessibility
- All inputs have associated labels
- Error messages linked to inputs via aria-describedby
- Focus trap in modals if used
- Keyboard navigation for file upload
- High contrast ratios (4.5:1 minimum)

## States & Interactions
- **Idle**: Form ready to fill
- **Filling**: Active field highlighted
- **Validating**: Real-time validation on blur
- **Submitting**: Disabled form, loading indicator
- **Success**: Confirmation screen with option to submit another
- **Error**: Clear error messages with guidance

This design prioritizes trust, clarity, and efficiency for users submitting important vaccination documents.
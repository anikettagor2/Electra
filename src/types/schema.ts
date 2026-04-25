
// Firestore Data Models

export type UserRole = 'admin' | 'manager' | 'analyst' | 'client' | 'guest' | 'strategist' | 'project_manager';

export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    role: UserRole;
    createdAt: number; // Timestamp
    phoneNumber?: string; // For guests
    companyName?: string; // Optional company name for clients (e.g., Political Party)
    websiteUrl?: string; // Additional profile links for clients
    clientCategory?: 'Retainer' | 'One-time' | 'Premium' | string; // Client category
    customRates?: Record<string, number>; // Custom simulation rates (legacy)
    multiTierRates?: Record<string, { label?: string; price: number }[]>; // Multiple price tiers per simulation model
    allowedModels?: Record<string, boolean>; // Which simulation models are visible
    initialPassword?: string; // Temp password for new users
    createdBy?: string; // UID of strategist or admin who created this user
    managedBy?: string; // UID of strategist managing this client
    assignedManagerId?: string; // UID of project manager assigned to this client
    payLater?: boolean; // allows client to skip immediate payment
    creditLimit?: number; // Maximum pending dues allowed for Pay Later
    deletionRequested?: boolean; // When user requests account deletion, pending admin approval
    deletionRequestedAt?: number; // Timestamp of deletion request

    // Role-specific metrics
    income?: number; // Total income for analyst
    rating?: number; // Rating for analyst
    portfolio?: { name: string; url: string; date?: number; clientName?: string; category?: string }[]; // Showcase simulations for analyst
    onboardingStatus?: 'pending' | 'approved' | 'rejected'; // For analysts created by strategist/PM
    totalRevenueGenerated?: number; // For strategist/PM
    whatsappNumber?: string;
    managedByPM?: string; // UID of PM managing this analyst (for groups)
    location?: string;
    skills?: string[]; // Specialization/Skills (e.g., Sentiment Analysis, Demographic Modeling)
    skillPrices?: Record<string, string>; // Price range per skill
    status?: 'active' | 'inactive';
    availabilityStatus?: 'online' | 'offline' | 'sleep'; // Presence status
    maxProjectLimit?: number; // Admin defined max active units limit for PM

    // Financial & Performance Metrics (Dynamic)
    lifetimeTotal?: number;
    pendingOutstanding?: number;
    totalEarned?: number;
    pendingDues?: number;
    accuracy?: string;
    verified?: boolean;
    lastSignInTime?: number;
    bio?: string;
    contact?: string;

    // Client Documents
    documents?: {
        agreement?: { url: string; name: string; uploadedAt: number };
        gst?: { url: string; name: string; uploadedAt: number };
        nda?: { url: string; name: string; uploadedAt: number };
        invoices?: { id: string; url: string; name: string; uploadedAt: number }[];
    };
}

export type SimulationStatus = 
    | 'sim_created' 
    | 'analyst_not_assigned' 
    | 'analyst_assigned' 
    | 'processing' 
    | 'review' 
    | 'completed' 
    | 'completed_pending_payment'
    | 'active'
    | 'in_review'
    | 'approved'
    | 'pending_assignment'
    | 'archived';


export interface Simulation {
    id: string;
    name: string;
    clientId: string; // ID of the client who owns this simulation
    clientName: string;
    brand?: string; // e.g., "UP 2027 Campaign"
    description?: string;
    deadline?: string;
    duration?: number;
    simulationType?: string; // e.g., 'Exit Poll', 'Predictive Trend', 'Swing Analysis'
    electionModel?: string; // e.g., 'First-Past-The-Post', 'Proportional'
    region?: string; // e.g., 'Uttar Pradesh', 'India'
    referenceLink?: string;
    referenceFiles?: { name: string; url: string; size?: number; type?: string; uploadedAt?: number; uploadedBy?: string }[];
    pmFiles?: { name: string; url: string; size?: number; type?: string; uploadedAt?: number; uploadedBy?: string }[];
    budget?: number;
    totalCost?: number; // Calculated cost
    selectedPricingTier?: number; // Index of selected pricing tier
    pricingTierLabel?: string; 
    pricingTierPrice?: number; 
    amountPaid?: number; 
    paymentStatus?: string; // 'half_paid', 'full_paid'
    assignedAnalystId?: string;
    dataSourceLink?: string; // Link to cloud storage with datasets
    dataSourceLinks?: string[]; 
    inputDatasets?: { name: string; url: string; size?: number; type?: string; uploadedAt?: number }[]; 
    generatedReports?: { name: string; url: string; size?: number; type?: string; uploadedAt?: number }[];
    audioTranscripts?: { name: string; url: string; size?: number; type?: string; uploadedAt?: number }[];
    referenceLinks?: string[];
    thumbnailUrl?: string; // Visual summary image
    status: SimulationStatus;
    createdAt: number;
    updatedAt: number;
    members: string[]; // Array of User UIDs (admin, manager, analyst, client)
    currentIterationId?: string; // ID of the latest active iteration
    ownerId?: string;
    assignmentStatus?: SimulationAssignmentStatus;
    downloadUnlockRequested?: boolean; 
    downloadsUnlocked?: boolean;       
    clientHasDownloaded?: boolean;     
    downloadUnlockedAt?: number;       
    isPayLaterRequest?: boolean;       
    assignmentAt?: number;             
    assignmentExpiresAt?: number;      

    // Management links
    assignedPMId?: string;             
    assignedSEId?: string;             
    analystPrice?: number;              
    analystDeclineReason?: string;      
    analystRating?: number;             
    analystReview?: string;             
    pmRemarks?: string;                
    autoPay?: boolean;                 
    scripts?: { name: string; url: string; size?: number; type?: string; uploadedAt?: number }[];

    // Audit Log
    analystPaid?: boolean;              
    analystPaidAt?: number;

    logs?: {
        event: string;
        user: string;
        userName: string;
        timestamp: number;
        details?: string;
    }[];
    iterationsCount?: number; // Total iterations handled
    completedAt?: number; 

    // Retention lifecycle
    downloadRetentionStartedAt?: number; 
    assetsCleanupAfter?: number; 
    assetsPurgedAt?: number; 
    finalDownloadCount?: number; 
    finalDataPurged?: boolean; 
    finalDataPurgedAt?: number; 
}

export type SimulationAssignmentStatus = 'pending' | 'accepted' | 'rejected' | 'expired';

export type IterationStatus = 'active' | 'approved' | 'adjustments_requested' | 'archived';

export interface Iteration {
    id: string;
    simulationId: string;
    version: number; // 1, 2, 3...
    reportUrl: string; // Storage URL
    visualUrl?: string; // Summary visual
    description?: string;
    status: IterationStatus;
    uploadedBy: string; // User UID
    createdAt: number;
    downloadCount?: number; 
    dataDeletedAt?: number; 
}

export type CommentStatus = 'open' | 'resolved';

export interface Comment {
    id: string;
    simulationId: string; 
    iterationId: string;
    userId: string;
    userName: string;
    userAvatar?: string | null;
    userRole: UserRole;
    content: string;
    timestamp: number; // Simulation timeline index (float)
    createdAt: number; 
    status: CommentStatus;
    replies?: CommentReply[];
    attachments?: string[]; 
}

export interface CommentReply {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    userRole: UserRole;
    content: string;
    createdAt: number;
    attachments?: string[];
}

export interface GuestSession {
    id: string; 
    name: string;
    phoneNumber: string;
    email?: string;
    simulationId: string;
    firstSeenAt: number;
}

export interface ClientInput {
    id: string;
    simulationId: string;
    iterationId: string; 
    type: 'file' | 'link' | 'voice';
    url: string;
    name: string; 
    uploadedBy: string; 
    createdAt: number;
    description?: string;
}

export interface Notification {
    id: string;
    userId: string;
    type: 'comment' | 'mention' | 'iteration' | 'approval' | 'assigned';
    title: string;
    message: string;
    link: string;
    read: boolean;
    createdAt: number;
}

export interface InvoiceItem {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

export interface Invoice {
    id: string;
    invoiceNumber: string; 
    simulationId?: string;
    clientId: string;
    clientName: string;
    clientEmail: string;
    clientAddress?: string;
    items: InvoiceItem[];
    subtotal: number;
    tax?: number; 
    total: number;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    issueDate: number; 
    dueDate: number; 
    notes?: string;
    createdAt: number;
    updatedAt: number;
}

export interface SimulationMessage {
    id: string;
    simulationId: string;
    senderId: string;
    senderName: string;
    senderRole: UserRole;
    text: string;
    createdAt: number;
}

export interface UploadSession {
    sessionId: string;
    simulationId: string;
    fileName: string;
    fileSize: number;
    totalChunks: number;
    completedChunks: number[];
    chunkPaths: Record<number, string>;
    status: 'uploading' | 'assembling' | 'done' | 'error';
    finalUrl?: string;
    createdAt: number;
    updatedAt: number;
}

export type SimulationJobStatus =
    | 'pending'
    | 'processing_summary'
    | 'summary_done'
    | 'modeling'
    | 'ready'
    | 'error';

export interface SimulationJob {
    id: string;
    simulationId: string;
    iterationId: string;
    sessionId?: string;
    status: SimulationJobStatus;
    summaryUrl?: string;
    modelUrl?: string;          
    playbackId?: string;      
    models?: string[];   
    durationSeconds?: number;
    accuracyScore?: number;
    confidenceInterval?: number;
    errorMessage?: string;
    createdAt: number;
    updatedAt: number;
}
